var numDatasets = localStorage.getItem('numDatasets');
var numPagina = localStorage.getItem('numPagina');


function loadOrganizaciones(){
        $('#organizacion').empty().append('<option value="">Cargando...</option>');        
        $.ajax({
            url: 'http://api.gipuzkoairekia.eus/organizacion/lista',
            dataType: 'xml',
            type: 'GET',                
            success: function(xml) {   
                $('#organizacion').empty().append('<option value="">Cualquiera</option>');            
                $('organizacion',xml).each(function(){
                    $("#organizacion").append("<option value='"+$(this).find('id').text()+"'>"+$(this).find('titulo').text()+"</option>");
                });
                let organizacion = localStorage.getItem('organizacionBuscar');
                if (organizacion != ''){
                    $('#organizacion').val(organizacion);
                }                
                $('.modal').modal('hide');
                

            },
            error: function(x, e) {
                $('.modal').modal('hide');
                alert('Error al cargar el listado de organizaciones: '+ e);
                
            }

        });
    
}

function loadCategorias(){
      $('#categoria').empty().append('<option value="">Cargando...</option>');        
      $.ajax({
            url: 'http://api.gipuzkoairekia.eus/categoria/lista',
            dataType: 'xml',
            type: 'GET',              
            success: function(xml) {
            $('#categoria').empty().append('<option value="">Cualquiera</option>');            
                $('categoria',xml).each(function(){
                    $("#categoria").append("<option value='"+$(this).find('id').text()+"'>"+$(this).find('titulo').text()+"</option>");
                });   
            },
            error: function(x, e) {
                alert('Error al cargar el listado de categorias: '+ e);
            }

        });
  
}

function calcularURLBusqueda(){
    var organizacion =  $('#organizacion').val();
    var categoria = $('#categoria').val();
    var texto = $('#texto').val();
    numDatasets =  $('#numDatasets').val();
    if (numDatasets == ''){
        numDatasets = 24;
    }
    numPagina = $('#numPagina').val();
    var numInicio = (numPagina-1) * numDatasets + 1;

    var url = 'http://api.gipuzkoairekia.eus/dataset/buscar?numRes='+numDatasets+'&iniRes=' + numInicio + '&';
    var params = 0;
    if (organizacion != "" || categoria != "" || texto != ""){
        if (organizacion != ""){
            params ++;
            url += 'org='+organizacion;
        }
        if (categoria != ""){
            if (params > 0){
                url += '&';
            }
            url += 'categoria=' + categoria;
        }
        if (texto != ""){
            if (params > 0){
                url += '&';
            }
            url += 'texto=' + texto;
        }
        return url;

    }else{
        alert ("Debe indicar al menos un elemento de búsqueda");
        return '';
    }
}

function buscarDatasets(){
    var url = calcularURLBusqueda();
    if (url != ''){
        $.ajax({
            url: url,
            dataType: 'xml',
            type: 'GET',        
            success: function(xml) {
                var resultados = $(xml).find('cont').text();
                var numPaginas = Math.ceil(resultados / numDatasets);
                $("#numPagina").empty();
                for (let i = 1; i <= numPaginas; i++) {
                    $("#numPagina").append("<option value='"+i+"'>"+i+"</option>");
                }
                $("#numPagina").val(numPagina);
                $('#listado').empty();
                localStorage.setItem('numDatasets', numDatasets );
                localStorage.setItem('numPagina', numPagina );
                $('dataset',xml).each(function(){
                    var descripcion = $(this).find('descripcion').text();
                    if (descripcion.length > 200){
                        descripcion = descripcion.substring(0, 196) + '[...]';
                    }
                    var etiquetas = '';
                    $('etiqueta', this).each(function(){
                        etiquetas += $(this).find('nombre').text() + ' ';
                    })
                    $('#listado').append('<div class="col"><div class="card shadow-sm"><div class="card-body"><h4>'+$(this).find('titulo').text() +'</h4><p class="card-text">'+descripcion +'</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn-sm btn-outline-secondary" onclick="irDetalle(\''+ $(this).find('id').first().text() +'\')">Detalle</button></div><small class="text-muted">'+ etiquetas +'</small></div></div></div></div>');
                });
    
            },
            error: function(x, e) {
                alert(e);
            }
    
        });
    }    
}

function irDetalle(id){
    let organizacion =  $('#organizacion').val();
    let categoria = $('#categoria').val();
    let texto = $('#texto').val();
    let listado = $('#listado').html();
    let paginas = $("#numPagina").html();

    localStorage.setItem('organizacionBuscar', organizacion);
    localStorage.setItem('categoriaBuscar', categoria);
    localStorage.setItem('textoBuscar', texto);
    localStorage.setItem('listadoDatasets', listado);
    localStorage.setItem('paginasListado', paginas);
    document.location.href = "/view/detalle.html?id=" + id;   
}

$('#buscar').on("click", function(){
    $("#numPagina").val(1);
    buscarDatasets();
} );

$('#numPagina').on("change", function(){
    buscarDatasets();
} );

function comprobarElementosGuardados(){
    let categoria = localStorage.getItem('categoriaBuscar');
    let texto = localStorage.getItem('textoBuscar');
    let listado = localStorage.getItem('listadoDatasets');
    let paginas = localStorage.getItem('paginasListado');

    $('#listado').html(listado);
    $('#categoria').val(categoria);
    $('#texto').val(texto);
    if (paginas != null && paginas != ''){
        $("#numPagina").html(paginas);
        $("#numPagina").val(numPagina);

    }
}



$( document ).ready(function() {
    $('.modal').modal('show');
    loadOrganizaciones();
    loadCategorias();
    comprobarElementosGuardados();    
    $('#numDatasets').val(numDatasets);
});