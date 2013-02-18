				<li class="point street-view" id="<?= $pid; ?>">
					<div class="marker camera"><h3>Imagem do local</h3></div>
					<div class="detail">
						<div class="photo"><?php streetView( $point->coords->lat, $point->coords->lon, $point->fov, $point->heading ); ?></div>
					</div>
				</li>