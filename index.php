<?php
include 'inc/util.php';
partial( array( 'header' ), array( 'title' => 'Trajetos+' ) );
?>
	<!-- home/search form page -->
	<div class="page page-home" id="home">
		<div class="hero" role="banner">
			<hgroup class="branding">
				<h1 class="title"><a href="<?php echo SELF; ?>" title="Trajetos+">Trajetos+</a></h1>
				<h2 class="slogan">Itinerários de ônibus com pontos de referência e locais de interesse.</h2>
				<div class="marker bus-marker"></div>
			</hgroup>
			<p class="description">Veja pontos de referência, fotos, mapas, vias e nunca mais desça no ponto errado. <a href="#" class="more" title="Saiba como o Trajetos+ funciona">Saiba mais &rarr;</a></p>
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
					<li><a href="#164" data-numero-linha="164"><span class="bounding">Teste: </span><span class="name">164 - Forte São João</span></a></li>
					<li><a href="#523" data-numero-linha="523"><span class="bounding">Teste: </span><span class="name">523 - Terminal Jacaraípe</span></a></li>
				</ul>
			</div>
		</div>
		<footer class="notice" role="contentinfo">
			<p class="availability">Serviço limitado, disponível apenas em algumas linhas de ônibus de Vitória.</p>
			<p class="copyright"><small>© <span id="current-year"></span> Trajetos+<br>Feito com <span class="wub" title="amor">♥</span> em Vitória.</small></p>
		</footer>
	</div>
	<!-- search result page -->
	<div class="page page-results hidden" id="page-results"></div>
	<div id="guide" class="guideline"></div>
	
<?php partial( array( 'footer' ) ); ?>