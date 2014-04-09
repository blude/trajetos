<?php
include 'inc/util.php';
partial( array( 'topbar' ), array( 'line_num' => $_GET['line'], 'line_name' => 'Forte São João' ) );
?>
		<div id="conteiner-mapa" class="conteiner-mapa"><div id="mapa" class="mapinha"></div></div>

		<div id="itinerary" class="itinerary" role="main">

			<ul id="past-points" class="past points">
				<li class="point" id="p0000">
					<div class="marker">Ponto de partida</div>
					<div class="detail"><p class="name"><strong>Inicio do trajeto</strong></p></div>
				</li>
			</ul>

			<div id="current-location" class="current current-location clearfix">
				<div class="bus-marker marker"><h3>Você está aqui</h3></div>
				<div class="detail">
					<p class="announcement">Próxima parada:</p>
					<p class="text"><strong class="next-bus-stop">Ponto nº ....</strong>, a menos de <span class="dist">...</span></p>
				</div>
			</div>

			<ul id="upcoming-points" class="upcoming points">
			<?php getItinerary( $_GET['line'] ); ?>
				<li class="point" id="pXXXX">
					<div class="marker">Ponto final</div>
					<div class="detail"><p class="name"><strong>Fim do trajeto</strong></p></div>
				</li>
			</ul>
		</div>