<?php
include 'inc/util.php';
partial( array( 'topbar' ), array( 'line_num' => 121, 'line_name' => 'Mário Cypreste' ) );
?>
		<div id="itinerary" class="itinerary" role="main">

			<ul id="past-points" class="past points">
				<li class="point turn turn-left" id="p0001">
					<div class="marker turn-left">Virar à esquerda</div>
					<div class="detail"><p class="name"><strong>Av. Fernando Ferrari</strong></p></div>
				</li>
			</ul>

			<div id="current-location" class="current current-location clearfix">
				<div class="bus-marker marker"><h3>Você está aqui</h3></div>
				<div class="detail">
					<p class="announcement">Próxima parada:</p>
					<p class="text"><strong>Ponto nº 4081</strong>, a menos de 200 m</p>
				</div>
			</div>

			<ul id="upcoming-points" class="upcoming points">
			<?php getItinerary(); ?>
			</ul>
		</div>