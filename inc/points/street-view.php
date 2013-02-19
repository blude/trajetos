				<li class="point street-view" id="<?= $pid; ?>">
					<div class="marker camera"><h3>Imagem do local</h3></div>
					<div class="detail">
						<div class="photo"><a href="#" class="box"><?php streetView( $point->coords->lat, $point->coords->lon, $point->fov, $point->heading ); ?></a></div>
					</div>
				</li>