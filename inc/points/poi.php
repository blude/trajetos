				<li class="point point-of-interest" id="<?= $pid ?>" data-lat="<?= $point->coords->lat; ?>" data-lon="<?= $point->coords->lon; ?>">
					<div class="marker"></div>
					<div class="detail">
						<p class="label"><strong><?= $point->label; ?></strong></p>
						<p class="category"><?= $point->category; ?></p>
					</div>
				</li>