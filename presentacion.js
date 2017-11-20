$(window).load(function(){

    //Probamos si el navegador soporta el elemento canvas.
    var soportaCanvas = 'getContext' in document.createElement('canvas');

    var diapositivas = $('#presentacion li'),
        actual = 0,
        presentacion = {width:0,height:0};

	//Usamos setTimeout para hacer asíncrona la ejecución, para hacer mejor uso del CPU.
    setTimeout(function(){

        if(soportaCanvas){
            $('#presentacion img').each(function(){

                if(!presentacion.width){
                    presentacion.width = this.width;
                    presentacion.height = this.height;
                }
                crearEfectoCanvas(this);
            });
        }

        $('#presentacion .flecha').click(function(){
            var li            = diapositivas.eq(actual),
                canvas        = li.find('canvas'),
                siguienteIndice    = 0;

            //Calculamos el siguiente índice.
            if($(this).hasClass('siguiente')){
                siguienteIndice = actual >= diapositivas.length-1 ? 0 : actual+1;
            }
            else {
                siguienteIndice = actual <= 0 ? diapositivas.length-1 : actual-1;
            }

            var siguiente = diapositivas.eq(siguienteIndice);

			//El navegador soporta canvas.
            if(soportaCanvas){
                canvas.fadeIn(function(){

                    // Show the next slide below the current one:
                    siguiente.show();
                    actual = siguienteIndice;

                    // Fade the current slide out of view:
                    li.fadeOut(function(){
                        li.removeClass('imagenActiva');
                        canvas.hide();
                        siguiente.addClass('imagenActiva');
                    });
                });
            }
            else { //El navegador no soporta canvas
                actual=siguienteIndice;
                siguiente.addClass('imagenActiva').show();
                li.removeClass('imagenActiva').hide();
            }
        });

    },100);
    
    //Funcion para crear el efecto con el elemento canvas.
    function crearEfectoCanvas(image){

        var canvas            = document.createElement('canvas'),
            canvasContext    = canvas.getContext("2d");

        canvas.width = presentacion.width;
        canvas.height = presentacion.height;

        //Dibujamos la imagen actual en el elemento canvas.
        canvasContext.drawImage(image,0,0);

        var imagen    = canvasContext.getImageData(0,0,canvas.width,canvas.height),
            data        = imagen.data;

        // Modificamos la imagen levemente.
        for(var i = 0,z=data.length;i<z;i++){
            data[i] = ((data[i] < 128) ? (2*data[i]*data[i] / 255) :
                        (255 - 2 * (255 - data[i]) * (255 - data[i]) / 255));
            data[++i] = ((data[i] < 128) ? (2*data[i]*data[i] / 255) :
                        (255 - 2 * (255 - data[i]) * (255 - data[i]) / 255));
            data[++i] = ((data[i] < 128) ? (2*data[i]*data[i] / 255) :
                        (255 - 2 * (255 - data[i]) * (255 - data[i]) / 255));
            ++i;
        }

        //Dibujamos la imagen modificada en el canvas.
        canvasContext.putImageData(imagen,0,0);

        //Insertamos el canvas antes de la imagen.
        image.parentNode.insertBefore(canvas,image);
    }

});