
function createMap() {	 
    var base_b5mapgris = L.tileLayer('https://b5m.gipuzkoa.eus/api/2.0/osgeo/tms/1.0.0/map/{z}/{x}/{y}.png', {attribution: 'b5m',tms: true,maxZoom: 20});
	var southWest = L.latLng(42.868073, -2.791214),
    northEast = L.latLng(43.570429, -1.681566),
    mybounds = L.latLngBounds(southWest, northEast);
	map = new L.map('map',
        {
			maxZoom: 19,
            minZoom: 9,
            scrollWheelZoom: false,
            continuousWorld: true,
            worldCopyJump: false, 
			center: [42.959293,-1.737566],
            zoom: appConfig.zoom,
            maxBounds: mybounds
           
        });
		
    var osmLink = '<a href="https://www.gipuzkoa.eus/es/web/bizikletaz"><img src="http://gipuzkoa.eus/documents/33095840/33112677/logo_mini.png/89f0ec27-5fc4-45f3-62d0-c4db3fed44f8"></img></a>',
        otmLink = '<a href="http://opentopomap.org/">OpenTopoMap</a>';
    var osmAttrib = '&copy; ' + osmLink;      

    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    osmAttrib = '&copy; ' + osmLink + ' Contributors',
    otmUrl = 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    otmAttrib = '&copy; '+otmLink+' Contributors';
	   
	 
    var osmMap = L.tileLayer(osmUrl, {attribution: osmAttrib});
		  
    map.addLayer(osmMap)
    var bglayer_Positron = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', 
    { attribution: '&copy; CartoDB',subdomains: 'abcd',maxZoom: 19}).addTo(map);

    $.ajax({
        url: 'http://api.gipuzkoairekia.eus/organizacion/lista',
        dataType: 'xml',
        type: 'GET',                
        success: function(xml) {   
            $('organizacion',xml).each(function(){
                var marker = L.marker([$(this).find('latitud').text(),$(this).find('longitud').text()]).addTo(map)
                .bindPopup('<b>'+$(this).find('titulo').text()+'</b><br />Nº de datasets: ' + $(this).find('numeroDatasets').text());
            });
            $('.modal').modal('hide');
        },
        error: function(x, e) {
            alert('Error al cargar el listado de organizaciones: '+ e);
            
        }

    });
    map.addLayer(base_b5mapgris);	
 }	

 $(document).ready(function(){
    $('.modal').modal('show');
    createMap();
 });


 var appConfig= 

{
  "latitud": 43.167343,
  "longitud": -2.200777,
  "zoom": 10,
  "logo" : "https://us.123rf.com/450wm/schlaumal/schlaumal1707/schlaumal170700228/83106569-bosque-fuego-icono-plano-dise%C3%B1o-gr%C3%A1fico-vectorial.jpg?ver=6",
}
;