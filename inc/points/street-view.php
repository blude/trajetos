<?php $photo_url = streetView( $point->coords->lat, $point->coords->lon, $point->fov, $point->heading ); ?>
				<li class="point street-view" id="<?= $pid; ?>" data-lat="<?= $point->coords->lat; ?>" data-lon="<?= $point->coords->lon; ?>">
					<div class="marker camera"><h3>Imagem do local</h3></div>
					<div class="detail">
						<div class="photo"><a href="<?= $photo_url ?>" class="box"><img src="<?= $photo_url ?>" alt="" width="208" height="156"></a></div>
					</div>
				</li>