<div id="pagePosts" class="pageAppli">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1" id="posteContenant">
                <p></p>
                <form name="commitPost" id="commitPostForm" novalidate>
                    <div class="row control-group">
                        <div class="form-group col-xs-12 floating-label-form-group controls">
                            <label>Titre</label>
                            <input type="text" name="titreBlog" class="form-control" placeholder="Title" id="titleBlog"
                                   required data-validation-required-message="Please enter a title.">
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <div class="row control-group">
                        <div class="form-group col-xs-12 floating-label-form-group controls">
                            <label>Sous titre</label>
                            <input type="text" name="sousTitreBlog" class="form-control"
                                   placeholder="Subtitle (short explanation in one sentence)" id="subtitleBlog" required
                                   data-validation-required-message="Please enter a short description of your post.">
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <div class="row control-group">
                        <div class="form-group col-xs-12 floating-label-form-group controls">
                            <label>Texte</label>
                            <textarea rows="20" style="width:100%" name="texte"
                                      placeholder='Entrez le texte ici'></textarea>
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <div class="row control-group">
                        <div class="form-group col-xs-12 floating-label-form-group controls">
                            <label>Fichier</label>
                            <input type="file" name="file" class="form-control" id="file"/>
                            <p class="help-block text-danger"></p>
                        </div>
                    </div>
                    <div class="row control-group">
                        <div class="form-group col-xs-12 floating-label-form-group controls">
                            <label>Actualité</label>
                            <input type="checkbox" name="news" class="form-control" id="actualite" value="news">
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
<div id="pagePost" class="pageAppli">
    <p></p>
    <article id="articleUnique">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1" id="contenantPostUnique">
                </div>
            </div>
        </div>
    </article>
</div>
<div id="pageModifyPost" class="pageAppli">
    <p></p>
    <article id="articleModify">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1" id="contenantPostUniqueModify">
                </div>
            </div>
        </div>
    </article>

</div>
