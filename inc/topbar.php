		<header class="headsign line line-<?= $page['line_num']; ?>" id="line-<?= $page['line_num']; ?>">
			<div class="button search-button"><a href="#go-search" class="search-button" title="Buscar linhas" id="go-search">Buscar</a></div>
			<div class="info" id="jump-to-current">
				<div class="line"><a href="#current-location"><strong class="number"><?= $page['line_num'] ?></strong> <span class="name"><?= $page['line_name']; ?></span></a></div>
				<div class="status updated">Atualizado agora</div>
			</div>
			<div class="button map-button"><a href="#" id="toggle-map" title="Mostrar mapa da linha">Mostrar mapa da linha</a></div>
		</header>