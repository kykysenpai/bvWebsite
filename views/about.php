<div id="pageAbout" class="pageAppli">
<div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1" id="aboutUtilisateur">
             	<p></p>   
             </div>
        </div>
    </div>

    <hr>
</div>
<div id="pageAboutAdmin" class="pageAppli">
<div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
                <p></p>
                <form name="changeAbout" id="changeAboutForm" novalidate>
                    <div class="row control-group">
                        <div class="form-group col-xs-12 floating-label-form-group controls">
                            <label>A propos</label>
                            <textarea rows="20" style="width:100%" id="texteareaAboutAdmin" name="texte" placeholder='Entrez le nouveau "à propos" ici'></textarea>
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <br>
                    <div id="success"></div>
                    <div class="row">
                        <div class="form-group col-xs-12">
                            <button type="submit" class="btn btn-default">Valider</button>
                        </div>
                    </div>
                </form>
             </div>
        </div>
    </div>

    <hr>
</div>
<div id="pageCode" class="pageAppli">
<div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
           		<p></p>
           		<form role="form" name="formChangeCode" novalidate>
				<div class="row control-group"> 
					<div class="form-group col-xs-12 floating-label-form-group controls">
						<label>Code</label>
						<input type="text" class="form-control" name="newCode" placeholder="Le nouveau code" required data-validation-required-message="Veuillez entrer le code.">
					</div>
				</div>
				<br>
				<div id="successChangeCode"></div>
				<div class="row">
					<div class="form-group col-xs-12">
						<button type="submit" class="btn btn-default">Changer le code</button>
					</div>
				</div>
				</form> 
            </div>
        </div>
    </div>

    <hr>
</div>