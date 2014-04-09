<?php
include 'inc/util.php';
partial( array( 'header' ), array( 'title' => 'Trajetos - Itinerários de ônibus com pontos de referência e locais de interesse.' ) );
?>
	<!-- home/search form page -->
	<div class="page page-home" id="home">
		<div class="hero" role="banner">
			<hgroup class="branding">
				<h1 class="title"><a href="<?php echo SELF; ?>">Trajetos</a></h1>
				<div class="marker bus-marker"></div>
			</hgroup>
			<p class="description">Veja pontos de referência, fotos, mapas, vias e nunca mais desça no ponto errado. <a href="about.php" class="more" title="Informações sobre Trajetos">Saiba mais</a>.</p>
		</div>
		<div class="search home-search" role="search" id="search-form">
			<form action="<?php echo SELF; ?>" action="get" name="search" class="search-form" id="line-search-form">
				<fieldset>
					<legend>Procurar linha</legend>
					<label for="lines" class="visuallyhidden label-line">Linha:</label>
					<input type="search" pattern="[0-9]*" step="1" name="bus-line" class="input number bus-line" id="line-search" placeholder="Digite o número da linha..." autocomplete="off" min="1" max="999" required>
				</fieldset>
			</form>
			<div id="search-suggestions" class="search-suggestions">
				<ul class="lines-found">
					<li><a href="#164" data-numero-linha="164"><span class="bounding">Ida: </span><span class="name">164 - Forte São João</span></a></li>
					<li><a href="#164" data-numero-linha="523"><span class="bounding">Volta: </span><span class="name">164 - Jardim Camburi</span></a></li>
				</ul>
			</div>
		</div>
		<footer class="notice" role="contentinfo">
			<p class="copyright"><small>© <span id="current-year">201X</span> Saulo Pratti<br>Feito com <span class="wub" title="abor">♥</span> em Vitória.</small></p>
		</footer>
	</div>
	<!-- search result page -->
	<div class="page page-results hidden" id="page-results"></div>
	<div id="guide" class="guideline"></div>
	
<?php partial( array( 'footer' ) ); ?>