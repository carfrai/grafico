      //Inicializacion de variables, margenes y tamaños
      var margin = { top: 100, right: 80, bottom: 20, left: 100 },
          w=1000-margin.left -margin.right,
          h=600-margin.top-margin.bottom,
          radius = 3;

      //Creacion del svg
      var svg = d3.select("body").append("svg")
          .attr("width",w+margin.left)
          .attr("height",h+margin.top)
          .style("margin-left",margin.left)

     
      //Escala del eje x y dominio
      var xScale = d3.scaleLinear()
          .domain([0, 10 ])
          .range([margin.left, w - margin.right]);  // Set margins for x specific

      //Escala del eje y y dominio
      var yScale = d3.scaleLinear()
          .domain([0, 1000 ])
          .range([h-margin.bottom,  margin.top]);  // Set margins for y specific

      //Añadimos la orientacion
      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);

      //tooltip con opacidad inicial 0 donde mostraremos el dato de los puntos
      var div = d3.select("body").append("div")	
          .attr("class", "tooltip")				
          .style("opacity", 0);     
      //titulos de los ejes
      var labels = svg.append("g")
          .attr("class","labels");

      //Titulo del grafico
      var title=svg.append("g")
          .attr("class","title");
      //año inicial de los datos
      var ano=2016;

      //Asignamos a la variable los buttons 
      var radios=document.querySelectorAll('input[type=radio][name="ano"]');

      //Seleccionamos el button del año inicial de los datos
      radios.forEach(function(d){if(parseFloat(d.id)==ano){d.checked=true;}});
      // Adds X-Axis as a)'g' element

      //Añadimos el eje X
      svg.append("g")
         .attr("class", "axis")
         .attr("transform", "translate(" + [0, h-margin.bottom] + ")" ) // Translate just moves it down into position (or will be on top)
         .call(xAxis);  // Call the xAxis function on the group

      //Añadimos el eje Y 
      svg.append("g")
         .attr("class","axis")
         .attr("transform","translate(" + [margin.left, 0] + ")")
         .call(yAxis);  // Call the yAxis function on the group

      //Añadimos las lineas de corte
      svg.append("line")
          .attr('x1',function(d){return xScale(0);})
          .attr('y1',function(d){return yScale(500);})
          .attr('x2',function(d){return xScale(10);})
          .attr('y2',function(d){return yScale(500);})
          .attr('stroke','black');

      svg.append("line")
          .attr('x1',function(d){return xScale(5);})
          .attr('y1',function(d){return yScale(0);})
          .attr('x2',function(d){return xScale(5);})
          .attr('y2',function(d){return yScale(1000);})
          .attr('stroke','black');
      
      
      //Añadimos los titulos de los ejes
      labels.append("text")
          .attr("transform","rotate(-90)")
          .attr("x",margin.right-h/2+30)
          .attr("y",margin.right-30)
          .attr("dy",".75em")
          .attr("font-size","19px")
          .style("text-anchor","end")
          .text("Indice de Desarrollo Humano");
      labels.append("text")
          .attr("x",margin.left+(w)/2+50)
          .attr("y",h-margin.bottom+30)
          .attr("dy",".71em")
          .attr("font-size","19px")
          .style("text-anchor","end")
          .text("Indice de Libertad Economica");

      //Añadimos el Titulo
      title.append("text")
          .attr("x",(margin.right+w)/2)
          .attr("y",(margin.top/2)+10)
          .attr("text-anchor","middle")
          .attr("font-size","32px")
          .attr("text-decoration","underline")
          .text("Libertad y Desarrollo");

    //Leemos losdatos
    d3.csv("dataDESI.csv",function(error,data){

      //Manejadores de eventos para el cambio de año
      radios.forEach(function(d){d.addEventListener('change',changeYear);});

      //Actualizamos los datos al año seleccionado
      var dataset=updateData();

      //Creamos los puntos, inicialmente en x=0 y los trasladamos a su posicion
      svg.selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx",function(d) { return xScale(0); })
          .attr("cy",function(d) { return yScale(d.y); })
          .attr("r",radius)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut)
          .attr("fill","#69b3a2")
          .transition()
          .delay(function(d,i){return(i*3);})
          .duration(2000)
          .attr("cx",function(d){return xScale(d.x);});

      //Guardamos el año seleccionado y actualizamos la grafica
      function changeYear(event){
        ano=parseFloat(this.value);
        upgradeGraphic();
      }

      //Actualizacion de grafica
      function upgradeGraphic(){
       
        //Actualizamos los datos
        dataset=updateData();

        //Eliminamos los puntos existentes
        svg.selectAll("circle")
          .remove();
          
      

        //Creamos los nuevos puntos
        svg.selectAll("circle")
          .data(dataset)
          .enter()
          .append("circle")
          .attr("cx",function(d) { return xScale(0); })
          .attr("cy",function(d) { return yScale(d.y); })
          .attr("r",radius)
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut)
          .attr("fill","#69b3a2")
          .transition()
          .delay(function(d,i){return(i*3);})
          .duration(2000)
          .attr("cx",function(d){return xScale(d.x);});
      }

      function updateData(){

        var dataset;

        //Se comprueba el año seleccionado y se actualizan los datos(x,y) en funcion del año seleccionado
        //Comprobamos que hay dato para actualizar
        if(ano==2016){
          data.forEach(function(d){
            d.x=parseFloat(d.EF2016);
            d.y=parseFloat(d.HD2016);
          });
          dataset=data.filter(function(d){return (d.EF2016!="");});
        }
        if(ano==2015){
          data.forEach(function(d){
            d.x=parseFloat(d.EF2015);
            d.y=parseFloat(d.HD2015);
          });
          dataset=data.filter(function(d){return (d.EF2015!="");});
        }
        if(ano==2014){
          data.forEach(function(d){
            d.x=parseFloat(d.EF2014);
            d.y=parseFloat(d.HD2014);
          });
          dataset=data.filter(function(d){return (d.EF2014!="");});
        }
        if(ano==2013){
          data.forEach(function(d){
            d.x=parseFloat(d.EF2013);
            d.y=parseFloat(d.HD2013);
          });
          dataset=data.filter(function(d){return (d.EF2013!="");});
        }
        if(ano==2012){
          data.forEach(function(d){
            d.x=parseFloat(d.EF2012);
            d.y=parseFloat(d.HD2012);
          });
          dataset=data.filter(function(d){return (d.EF2012!="");});
        }
        if(ano==2011){
          data.forEach(function(d){
            d.x=parseFloat(d.EF2011);
            d.y=parseFloat(d.HD2011);
          });
          dataset=data.filter(function(d){return (d.EF2011!="");});
        }
        if(ano==2010){
          data.forEach(function(d){
            d.x=parseFloat(d.EF2010);
            d.y=parseFloat(d.HD2010);
          });
          dataset=data.filter(function(d){return (d.EF2010!="");});
        }

        return dataset;
  

      }






      //Evento al poner el cursor sobre el punto 
      function handleMouseOver(event, i) {  // Add interactivity

            //Cambiamos el color y tamaño del punto 
            d3.select(this)
              .attr("fill","#000000")
              .attr("r",radius * 2);
            //Mostramos el tooltip y los datos en el 
            div.transition()
                .duration(200)		
                .style("opacity", 1);		
            div	.html("Pais:"+event.Country+ "<br/>"  +"ILE:"+event.x+"<br/>"+"IDH:"+event.y )	
                .style("left", (xScale(event.x)+8)+"px")		
                .style("top", (yScale(event.y)+8)+"px");	

          
      }
      //Evendo al retirar el cursor sobre el punto
      function handleMouseOut(event, i) {
            //Cambiamos el color y el tamaño del punto a los originales 
            d3.select(this)
               .attr("fill","#69b3a2")
               .attr("r",radius);
            //Ocultamos el tooltip
            div.transition()		
              .duration(500)		
              .style("opacity", 0);	
          }
    });
