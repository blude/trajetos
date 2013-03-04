				<li class="point turn" id="<?= $pid; ?>" data-lat="<?= $point->coords->lat; ?>" data-lon="<?= $point->coords->lon; ?>">
					<div class="marker turn-<?= $point->dir; ?>"><?= $point->direction; ?></div>
					<div class="detail"><p class="address"><strong><?= $point->address; ?></strong></p></div>
				</li>