/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, jwt } = app;
  router.get('/', controller.home.index);
  router.post('/login', controller.home.user);
  router.get('/morain/user', jwt, controller.home.getUserInfo);
  // article
  router.get('/articleLists', controller.article.articleLists);
  router.get('/article', controller.article.article);
  router.post('/morain/addOnlineEditArticle', jwt, controller.article.addOnlineEditArticle);
  router.get('/morain/delete', controller.article.delete);
  // code
  router.get('/codeListQuery', controller.codeList.codeList);
  router.get('/codeQuery', controller.codeList.codeQuery);
  router.post('/codeSave', jwt, controller.codeList.codeSave);
  // Tools
  router.get('/morain/queryToolsByPage', controller.tools.toolslist);
  router.post('/morain/addTool', controller.tools.addTool);
  // pf
  router.get('/morain/queryWeightList', controller.pf.queryWeightList);
  router.post('/morain/addWeightData', controller.pf.addWeight);
  // interview
  router.get('/morain/interview/query', controller.interview.query);
  router.post('/morain/interview/add', controller.interview.add);
};
