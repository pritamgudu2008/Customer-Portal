'use strict';

describe('Feedbacks E2E Tests:', function () {
  describe('Test feedbacks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/feedbacks');
      expect(element.all(by.repeater('feedback in feedbacks')).count()).toEqual(0);
    });
  });
});
