$('#buscador').on("click", function(){
    document.location.href='/view/buscador.html';
} );

localStorage.removeItem('organizacionBuscar');
localStorage.removeItem('categoriaBuscar');
localStorage.removeItem('textoBuscar');
localStorage.removeItem('listadoDatasets');
localStorage.removeItem('paginasListado');