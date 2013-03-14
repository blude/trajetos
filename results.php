<?php
include 'inc/util.php';
partial( array( 'topbar' ), array( 'line_num' => 164, 'line_name' => 'Forte São João' ) );
?>
		<div id="conteiner-mapa" class="conteiner-mapa"><div id="mapa" class="mapinha"></div></div>

		<div id="itinerary" class="itinerary" role="main">

			<ul id="past-points" class="past points">
				<li class="point turn turn-left" id="p0000">
					<div class="marker">Ponto de partida</div>
					<div class="detail"><p class="name"><strong>Inicio do trajeto</strong></p></div>
				</li>
			</ul>

			<div id="current-location" class="current current-location clearfix">
				<div class="bus-marker marker"><h3>Você está aqui</h3></div>
				<div class="detail">
					<p class="announcement">Próxima parada:</p>
					<p class="text"><strong class="next-bus-stop">Ponto nº 0000</strong>, a menos de <span class="dist">...</span></p>
				</div>
			</div>

			<ul id="upcoming-points" class="upcoming points">
			<?php getItinerary(); ?>
			</ul>
		</div>