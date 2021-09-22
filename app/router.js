'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/articleLists', controller.article.articleLists);
  router.get('/article', controller.article.article);
  router.post('/morain/addOnlineEditArticle', controller.article.addOnlineEditArticle);
  router.get('/morain/delete', controller.article.delete);
  // code
  router.get('/codeListQuery', controller.codeList.codeList);
  router.get('/codeQuery', controller.codeList.codeQuery);
  router.post('/codeSave', controller.codeList.codeSave);
};
