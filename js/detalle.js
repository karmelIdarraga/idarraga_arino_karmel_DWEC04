var datasetId;
var categorias = [];


function loadDataset(){
    $('.modal').modal('show');
    $.ajax({
        url: 'http://api.gipuzkoairekia.eus/dataset/'+datasetId,
        dataType: 'xml',
        type: 'GET',                
        success: function(xml) {   
            cargarDatosDataset(xml);
            $('.modal').modal('hide');

        },
        error: function(x, e) {
            $('.modal').modal('hide');
            alert('Error al cargar el detalle del dataset: '+ e);
        }

    });

}

function cargarDatosDataset(xml){
    $('#titulo').text($(xml).find('titulo').text());
    $('#descripcion').text($(xml).find('descripcion').first().text());
    let ficheros = '';
    $('recurso',xml).each(function(index){
        if (index % 2 == 0){
            ficheros += "<div class='row mb-2'><div class='col-12 col-md-6'><a href='"+$(this).find('url').text()+"' target='_blank'><span class='tipo'>"+$(this).find('formato').text()+"</span><span class='nombreRecurso'>"+$(this).find('nombre').text()+" ("+($(this).find('tamanio').text() / 1024).toFixed(2) + "MB)</span></a></div>";
        }else{
            ficheros += "<div class='col-12 col-md-6'><a href='"+$(this).find('url').text()+"' target='_blank'><span class='tipo'>"+$(this).find('formato').text()+"</span><span class='nombreRecurso'>"+$(this).find('nombre').text()+" ("+($(this).find('tamanio').text() / 1024).toFixed(2) + "MB)</span></a></div></div>";
        }
    });
    $('#archivos').append(ficheros);
    $('#fecha-actualizacion').text($(xml).find('fechaModificacion').text().substring(0, 10));
    let categoria;
    $(categorias).each(function(){
        if ($(this)[0]==$(xml).find('categoria').text()){
            categoria = $(this)[1];
            return false;
        }
    })
    $('#categoria').text(categoria);
    $('#licencia').text($(xml).find('licenciaTitulo').text());
    $('#version').text($(xml).find('version').text());
    $('#autorNombre').text($(xml).find('autor').text());
    $('#emailAutor').text($(xml).find('emailAutor').text());
    $('#fechaCreacion').text($(xml).find('fechaCreacion').text().substring(0, 10));
    $('#frecuencia').text($(xml).find('periodoActualizacion').text() +' ' + $(xml).find('unidadPedAct').text());
    $('#emailSoporte').text($(xml).find('emailSoporte').text());
    $('#idDataset').text(datasetId);
    $('etiqueta',xml).each(function(){
        $("#listaEtiquetas").append("<li>"+$(this).find('nombre').text()+"</li>");    
    });
    setTimeout(function() { 
        $('.modal').modal('hide');
    }, 2000);
    
}

function loadCategorias(){    
    $.ajax({
          url: 'http://api.gipuzkoairekia.eus/categoria/lista',
          dataType: 'xml',
          type: 'GET',              
          success: function(xml) {
            $('categoria',xml).each(function(){
                categorias.push([$(this).find('id').text(), $(this).find('titulo').text()]);    
            });
          },
          error: function(x, e) {
              alert('Error al cargar el listado de categorias: '+ e);
          }
      });
}


$( document ).ready(function() {
    
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('id')){
        datasetId = searchParams.get('id');
    }
    loadCategorias();
    loadDataset();
    

    
});