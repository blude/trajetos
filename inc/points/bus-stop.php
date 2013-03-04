				<li class="point bus-stop" id="<?= $pid; ?>" data-lat="<?= $point->coords->lat; ?>" data-lon="<?= $point->coords->lon; ?>">
					<div class="marker bus-sign"><h3>Ponto de parada</h3></div>
					<div class="detail">
						<p class="name"><strong>Ponto nº <?= $point->number; ?></strong></p>
						<p class="description"><?= $point->reference; ?></p>
						<p class="hood"><?= $point->hood; ?></p>
					</div>
				</li>