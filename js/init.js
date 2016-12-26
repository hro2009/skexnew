$(document).ready(function() {
    var i = 0,
        trash = null,
        fabricInitStatus = false,
        canvasArr = [],
        todayCompleteStaus = false,
        isDrawingMode = false,
        TIME_TRASH = 400,
        DEMO_IMG_PATH = "images/products-background/",
        $carousel =  $('.carousel'),
        $carouselControl =  $('.carousel-control'),
        $caruselWraper = $("#carusel-wraper"),
        $products = $(".ske-type-most-used li a"),
        $selectedProductsContent = $(".ske-selected-products .ske-products-list"),
        $trash = $(".ske-trash-tool");
       


    $('[data-toggle="tooltip"]').tooltip();
    /* Magnific Popup */
    PopupInit();
    $carousel.carousel({
        interval: false
    });
    carouselControl();

    /*  add Product and remove  */

    $products.click(addSelectedProduct);
    $trash.click(removeSelectedProduct);

    function addSelectedProduct(e) {
        if(!todayCompleteStaus === false) return;
        var $selectedProductItem = $('<a href="javascript:;"></a>'),
            $selectedProductItemContent = $('<li></li>').append($selectedProductItem),
            selectedProductText = $(this).data('text'),
            selectedProductImage = $(this).data('image');
        $selectedProductItem.text(selectedProductText);
        $selectedProductItem.data('text', selectedProductText);
        $selectedProductItem.data('image', selectedProductImage);
        $selectedProductItem.click(selectProduct);
        $selectedProductsContent.append($selectedProductItemContent);
        fabricInit(DEMO_IMG_PATH+selectedProductImage);
        updateSelectedProduct($selectedProductItem);
         
    }

    function updateSelectedProduct(active) {
        carouselControl();
        var $selectedProducts = $(".ske-products-list li a");
        $selectedProducts.removeClass('selected');
        active.addClass('selected');
    }

    function selectProduct(e) {
        if (!$(this).hasClass('selected')) {
            updateSelectedProduct($(this));
            $carousel.carousel($(this).closest('li').index());
        }
    }
    function removeSelectedProduct() {
        var activeIndex = getActiveCaruselIndex(),
            $carouselItem =  $('.carousel .item'),
            $selectedProduct = $(".ske-products-list li a.selected"),
            $selectedProductContent = $selectedProduct.closest('li');
        if ($selectedProduct.length < 1) return;
        var canvas = getActiveCanvas(),
            canvas_objects = canvas._objects;
    
        if (canvas_objects.length !== 0) {
            showWarningMessage();
        }else{
            removeProduct();
        }

        function removeProduct(){
            if($carouselItem.length === 1 ) {
                    $carouselItem.remove();
            }else if($carouselItem.length>1){
                trash =  activeIndex
                $carousel.carousel('prev');
            }
            canvasArr.splice(activeIndex,1)
            $selectedProductContent.slideUp(TIME_TRASH, trashCallBack);
            function trashCallBack() {
                $selectedProductContent.remove();
            }
        }
        function showWarningMessage(){
            swal({
                  title: 'Are you sure?',
                  text: "You won't be able to revert this!",
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Yes, delete it!'
            }).then(

                function () {
                    swal({
                        title: 'Deleted!',
                        text: 'Your file has been deleted.',
                        type: 'success',
                        showCloseButton: false,
                        showConfirmButton: false,
                        timer: 400
                    }).then(
                            function () {
                            },
                            function () {
                                removeProduct();
                            }
                    )

                },
                function () {}
            )
        }
    }
    /*      *** END ***            */
    $('#myModal').on('shown.bs.modal', function() {
        //
    })
  
    /* Canvas */
    var $$ = function(id) {
        return document.getElementById(id)
    }
    $('#myCarousel').on('slide.bs.carousel', function (event) {
        deactivateAll();
    })
    function deactivateAll(){
         var canvas = getActiveCanvas();
         if(canvas !== undefined ){
            canvas.deactivateAll().renderAll();
            console.log('deactive....')
         }
    };
    $('#myCarousel').on('slid.bs.carousel', function (event) {
        if(trash !== null){
            $(".carousel .item").eq(trash).remove();
        }
        trash = null;
        var index = getActiveCaruselIndex();
        var active = $(".ske-products-list li a").eq(index);
        console.log(index, event);
        updateSelectedProduct(active);
        var canvas = getActiveCanvas();

        canvas.mode ? drawingMode.value = canvas.mode: drawingMode.selectedIndex = 0;
        drawingColorEl.value = canvas.freeDrawingBrush.color ;
        drawingLineWidthEl.value  = canvas.freeDrawingBrush.width;

        drawingModel(canvas);
    })
    var drawingModeEl = $$('drawing-mode'),
        drawingMode = $$('drawing-mode-selector'),
        drawingColorEl = $$('drawing-color'),
        drawingLineWidthEl = $$('drawing-line-width'),
        saveModel = $$('save-canvas'),
        clearEl = $$('clear-canvas');


    function fabricInit(productImage) {
        deactivateAll();
        fabricInitStatus = true;
        console.log('fabricInit...');
        $caruselWraper.find('.item').removeClass('active');
        i++;
        var cId = "cf-" + i,
            $imgArea = $(".ske-image-area"),
            imgAreaWidth = $imgArea.width(),
            imgAreaHeight = $imgArea.height(),
            $canvasEl = $("<canvas></canvas>");

        $canvasEl.attr("id", cId);
        $canvasEl.attr("width", imgAreaWidth + "px");
        $canvasEl.attr("height", imgAreaHeight + "px");
        var $caruselIitem = $("<div class='item active'></div>").append($canvasEl);
        $caruselIitem.data('index', i);
        $caruselWraper.append($caruselIitem);
        var canvasFabric = this.__canvas = new fabric.Canvas(cId, {
            isDrawingMode: isDrawingMode
        });
        drawingModel(canvasFabric);
        canvasArr.push(canvasFabric);
        var canvas = canvasFabric;
        /*canvas.setBackgroundImage(productImage, canvas.renderAll.bind(canvas), {
            width: canvas.width,
            height: canvas.height,
            // Needed to position backgroundImage at 0/0
            originX: 'left',
            originY: 'top'
        });*/
          fabric.Image.fromURL(productImage, function(img) {
            img.scale(0.5).set({
              left:0,
              top: 0,
              angle: 0
              
            });
            canvas.add(img).setActiveObject(img);
          });
        fabric.Object.prototype.transparentCorners = false;

        clearEl.onclick = function() {
            var canvas = getActiveCanvas();
            var active_object = canvas.getActiveObject();
            var canvas_objects = canvas._objects;
            if (active_object !== null) {
                canvas.remove(active_object);
                canvas.renderAll();
            } else if (canvas_objects.length !== 0) {
                var last_object = canvas_objects[canvas_objects.length - 1];
                canvas.remove(last_object);
                canvas.renderAll();
            }
        };

        saveModel.onclick = function() {
            NProgress.start();
            var canvas = getActiveCanvas();
            var imgDataUrl = canvas.toDataURL({
                format: 'png'
            })
            console.log(imgDataUrl)
            var $selectedProduct = $(".ske-products-list li a.selected");
            var desc = $selectedProduct.data('text');
           $.ajax({
                type:"post",
                url: "main.php",
                data: {imgDataUrl: imgDataUrl, desc: desc},
                success: function (res) {
                    console.log(res);

                    NProgress.done();
                    swal({
                        title: 'Good job!',
                        type: 'success',
                        showCloseButton: false,
                        showConfirmButton: false,
                        timer: 1000

                    }).then(
                        function () {
                            alert()
                        },
                        // handling the promise rejection
                        function (dismiss) {
                             /* var index =  getActiveCaruselIndex();
                              $("#myModal").modal('hide');
                              $(".ske-products-list li a:not(.selected)").remove();
                              $('.carousel .item:not(.active)').remove();
                              canvasArr.splice(0,index);
                              canvasArr.splice(1);
                              todayCompleteStaus = true;
                              carouselControl();*/
                        }
                    )
                }
            })
        }
        drawingModeEl.onclick = function() {
            var canvas = getActiveCanvas();
            canvas.isDrawingMode = !canvas.isDrawingMode;
            drawingModel(canvas);
        };

        if (fabric.PatternBrush) {
            function getvLinePatternBrush(canvas) {
                var vLinePatternBrush = new fabric.PatternBrush(canvas);
                vLinePatternBrush.getPatternSrc = function() {
                    var patternCanvas = fabric.document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    var ctx = patternCanvas.getContext('2d');
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(0, 5);
                    ctx.lineTo(10, 5);
                    ctx.closePath();
                    ctx.stroke();
                    return patternCanvas;
                };
                return vLinePatternBrush;
            }
            function gethLinePatternBrush(canvas) {
                var hLinePatternBrush = new fabric.PatternBrush(canvas);
                hLinePatternBrush.getPatternSrc = function() {
                    var patternCanvas = fabric.document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = 10;
                    var ctx = patternCanvas.getContext('2d');
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 5;
                    ctx.beginPath();
                    ctx.moveTo(5, 0);
                    ctx.lineTo(5, 10);
                    ctx.closePath();
                    ctx.stroke();
                    return patternCanvas;
                };
                return hLinePatternBrush;
            }
            function getSquarePatternBrush(canvas) {
                var squarePatternBrush = new fabric.PatternBrush(canvas);
                squarePatternBrush.getPatternSrc = function() {
                    var squareWidth = 10,
                        squareDistance = 2;
                    var patternCanvas = fabric.document.createElement('canvas');
                    patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
                    var ctx = patternCanvas.getContext('2d');
                    ctx.fillStyle = this.color;
                    ctx.fillRect(0, 0, squareWidth, squareWidth);
                    return patternCanvas;
                };
                return squarePatternBrush;
            }
            function getDiamondPatternBrush(canvas) {
                var diamondPatternBrush = new fabric.PatternBrush(canvas);
                diamondPatternBrush.getPatternSrc = function() {
                    var squareWidth = 10,
                        squareDistance = 5;
                    var patternCanvas = fabric.document.createElement('canvas');
                    var rect = new fabric.Rect({
                        width: squareWidth,
                        height: squareWidth,
                        angle: 45,
                        fill: this.color
                    });
                    var canvasWidth = rect.getBoundingRectWidth();
                    patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
                    rect.set({
                        left: canvasWidth / 2,
                        top: canvasWidth / 2
                    });
                    var ctx = patternCanvas.getContext('2d');
                    rect.render(ctx);
                    return patternCanvas;
                };
                return diamondPatternBrush;
            }
            var img = new Image();
            img.src = 'http://fabricjs.com/assets/honey_im_subtle.png';
            function getTexturePatternBrush(canvas) {
                var texturePatternBrush = new fabric.PatternBrush(canvas);
                texturePatternBrush.source = img;
                return texturePatternBrush;
            }


        }
        drawingMode.onchange = function() {
            var canvas = getActiveCanvas();
            switch (this.value){
                case 'vline' :
                    canvas.freeDrawingBrush = getvLinePatternBrush(canvas);
                    canvas.mode = 'vline';
                    break;
                case 'hline' :
                    canvas.freeDrawingBrush = gethLinePatternBrush(canvas);
                    canvas.mode = 'hline';
                    break;
                case 'square' :
                    canvas.freeDrawingBrush = getSquarePatternBrush(canvas);
                    canvas.mode = 'square';
                    break;
                case 'diamond' :
                    canvas.freeDrawingBrush = getDiamondPatternBrush(canvas);
                    canvas.mode = 'diamond';
                    break;
                case 'texture' :
                    canvas.freeDrawingBrush = getTexturePatternBrush(canvas);
                    canvas.mode = 'texture';
                    break;
                default:
                    canvas.freeDrawingBrush = new fabric[this.value + 'Brush'](canvas);
                    canvas.mode = this.value;
                    break;
            }
            if (canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = drawingColorEl.value;
                canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
                console.log(canvas.freeDrawingBrush);
            }
        };
        drawingColorEl.onchange = function() {
            var canvas = getActiveCanvas();
            canvas.freeDrawingBrush.color = this.value;
        };
        drawingLineWidthEl.onchange = function() {
            var canvas = getActiveCanvas();
            canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
            this.previousSibling.innerHTML = this.value;
        };
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = drawingColorEl.value;
            canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
            canvas.freeDrawingBrush.shadowBlur = 0;
        }
    };
    function carouselControl(){
        var   $carouselItem =  $('.carousel .item');
        if($carouselItem.length>1){
            $carouselControl.fadeIn();
        }else{
            $carouselControl.fadeOut();
        }
    }
    function drawingModel(canvas) {
        canvas.isDrawingMode ? drawingModeEl.classList.add("active") : drawingModeEl.classList.remove("active");
    }
    function getActiveCanvas() {
        var index = getActiveCaruselIndex();
        return canvasArr[index];
    }
    function getActiveCaruselIndex() {
        return $('#myCarousel .active').index('#myCarousel .item')
    }
});