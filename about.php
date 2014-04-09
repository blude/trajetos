<?php 
include 'inc/util.php';
partial( array( 'header' ), array( 'title' => 'Sobre - Trajetos' ) );
?>
	<div class="page page-results" id="page-about">
		<header class="headsign line-about" id="line-about">
			<div class="button search-button"><a href="index.php" class="search-button" title="Buscar linhas" id="go-home">Buscar</a></div>
			<div class="info" id="goto-current">
				<div class="line"><a href="#current-location">Sobre</a></div>
			</div>
		</header>

		<div id="about" class="hero hero-about" role="main">
			<h2>Trajetos</h2>
			<p>Este <em>web app</em> faz parte da pesquisa realizada para 
			o Projeto de Graduação para conclusão do curso de Desenho Industrial da Universidade Federal do Espírito Santo (Ufes).</p>
			<p>A pesquisa realizada entre os meses de agosto de 2012 e abril de 2013.</p>
			<p>Desenvolvido por Saulo Pratti sob a orientação do professor Prof. Dr. Mauro Pinheiro.</p>
			<p><small>(c) 2013 Saulo Pratti &amp; UFES</small></p>
		</div>
	</div>
	<div id="guide" class="guideline"></div>
	
<?php partial( array( 'footer' ) ); ?>