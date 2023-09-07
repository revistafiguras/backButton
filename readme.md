# Agregar botón en Visor LensGalley
1. Entrar a la ruta lensgalley/templates
2. Editar el archivo display.tpl con el siguiente código:
```
 $("body").append('<a href="./" class="go-back"><i class="fa fa-arrow-le></i> <span>Regresar</span></a>');
```
```
3. Debe quedar así
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
                $("body").append('<a href="./" class="go-back"><i class="fa fa-arrow-left"></i> <span>Regresar</span></a>');
        });
{/literal}</script>
```
# Agregar css en lens.css
```
a.go-back {
  top: 0;
  left: 20px;
  position: absolute;
  z-index: 5000;
  display: block;
  font-size: 18px;
  line-height: 30px;
  color: rgba(0, 0, 0, 0.6);
  background: #FFFEF5DD;
  border-right: 1px solid #D8D9C1;
  border-bottom: 1px solid #D8D9C1;
  padding: 2px 10px; }

a.go-back:hover {
  background: #FFFEF5; }

a.go-back span {
  display: none;
  font-size: 16px;
  font-weight: 400; }

a.go-back:hover span {
  display: inline;
  padding-left: 6px;
  padding-right: 6px; }
```
