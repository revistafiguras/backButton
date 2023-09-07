{**
 * plugins/generic/lensGalley/display.tpl
 *
 * Copyright (c) 2014-2017 Simon Fraser University
 * Copyright (c) 2003-2017 John Willinsky
 * Distributed under the GNU GPL v2. For full terms see the file docs/COPYING.
 *
 * Embedded viewing of a Lens galley.
 *}
<script src="{$jQueryUrl}"></script>
<script src="{$pluginLensPath}/lens.js"></script>
<script src="//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
<script type="text/javascript">{literal}

	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	linkElement.href = "{/literal}{$pluginLensPath|escape:"javascript"}{literal}/lens.css"; //Replace here
	document.head.appendChild(linkElement);
	
	replace_images  = {/literal}{$replaceImages}{literal};
	translate  = {/literal}{$translationStrings}{literal};

	
	$(document).ready(function(){
		var app = new Lens({
			document_url: "{/literal}{$xmlUrl|escape:'javascript'}{literal}"
		});
		app.start();
		window.app = app;
		$("body").append('<a href="./" class="go-back"><i class="fa fa-arrow-le></i> <span>Regresar</span></a>');
	});
{/literal}</script>
