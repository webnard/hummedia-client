'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('hummedia app', function() {

  beforeEach(function() {
    browser().navigateTo('/app/index.html');
  });
  
  describe('splash', function(){
     it('should link to the copyright page for the image', function(){
         expect(element('#footer-license').attr('href')).not().toEqual('#');
         expect(element('#footer-license').attr('href')).not().toEqual('');
         expect(element('#footer-license').attr('href')).not().toEqual(undefined);
     }) 
  });

  describe('translation', function(){
      it('should switch to Spanish from English using the dropdown menu', function(){
	  select('language').option(0);
          expect(element('#nav-search').text()).toEqual('Search');
	  select('language').option(1);
	  sleep(2);
	  expect(element('#nav-search').text()).toEqual('Buscar');
      });
  
      afterEach(function() {
	 select('language').option(0);
      });
  });
 
  describe ('search', function() {
        beforeEach(function() {
            browser().navigateTo("#/search");
        });

        it('should render the search input box when user is on the search page', function() {
            expect(element('#search-form input[type=search]','Search Input').count()).toEqual(1);
        });

        it('should have a link for the advanced search on the form', function() {
            expect(element('#search_content .advanced-toggle', 'Advanced Link').text()).toMatch('Advanced');
        });

        it('should be able to go to advanced search from the basic search page', function() {
            element('#search_content .advanced-toggle a', 'Advanced Link').click();
            expect(element('#search-advanced:visible', 'Advanced Search').count()).toBe(1);
            expect(browser().location().search()).toEqual({advanced: true});
        });

        it('should update the search box when the URL changes', function() {
            browser().navigateTo('#/search?query=Potato%20Casserole');
            expect(input('query').val()).toEqual('Potato Casserole');
        });
        
        it('should remove the search from the URL when it is removed from the input', function() {
            browser().navigateTo('#/search?query=Potato%20Casserole');
            input('query').enter('      ');
            expect(browser().location().search()).toEqual({});
        });
        
        /* @TODO */
        /*it('should update the search results when we programmatically change the URL', function() {
            expect(repeater('#search-results ul li').count()).toEqual(0);
            browser().location().search({query: "o"});
            sleep(2);
            expect(repeater('#search-results ul li').count()).not().toEqual(0);
        });*/
  });

  describe('advanced search', function() {
        beforeEach(function() {
            browser().navigateTo("#/search?advanced");
        });

        it('should display the advanced search fields', function() {
            expect(element('#search-advanced:visible', 'Advanced Search Fields').count()).toBe(1);
        });

        it('should not allow submitting with blank fields', function() {
            expect(element('#search-advanced input[type=submit]', 'Submit Button').attr('disabled')).toBeTruthy();
        });

        it('should allow submitting after filling in a field', function() {
            input("advanced['ma:title']").enter('Sam Walton');
            expect(element('#search-advanced input[type=submit]', 'Submit Button').attr('disabled')).toBeFalsy();
        });
    
	describe('url', function() {
	    beforeEach(function(){
		 browser().navigateTo("#/search?advanced");
		 input("advanced['ma:title']").enter("Henry David Thoreau");
		 element('#search-advanced input[type=submit]').click();
	    });
	
	    it('should be updated on submission', function() {
		 expect(browser().location().search()).toEqual({'advanced': true, 'ma:title': 'Henry David Thoreau'});
	    });
	
	    it('should have advanced-specific parameters removed on return to basic search', function() {
		 element('.advanced-toggle a').click();
		 expect(browser().location().search()).toEqual({});
	    });
	
	    it('should update the input boxes based on its parameters', function() {
		 browser().navigateTo("#/search?advanced&ma:title=Ben&ma:description=Leslie&yearfrom=1980&yearto=2000");
		 expect(input("advanced['ma:title']", "Title input").val()).toEqual('Ben');
		 expect(input("advanced['ma:description']", "Description input").val()).toEqual('Leslie');
		 expect(input("advanced.yearfrom", "Year from input").val()).toEqual('1980');
		 expect(input("advanced.yearto", "Year to input").val()).toEqual('2000');
	    });
	});
  });
      describe('error-page', function() {
        it('should show a 404 error when we give a non-existant collection', function() {
            expect(element('#error-modal').css('display')).toBe('none');
            browser().navigateTo('#/collection/51156f9da51824723bfc99f7');
            expect(element('#error-modal').css('display')).not().toBe('none');
            expect(element('#error-message .error-code').text()).toBe('404');
        });
        
        it('should show a 400 error when we give a malformed collection', function() {
            expect(element('#error-modal').css('display')).toBe('none');
            browser().navigateTo('#/collection/malformed');
            expect(element('#error-modal').css('display')).not().toBe('none');
            expect(element('#error-message .error-code').text()).toBe('400');
        });
        
        describe('closing', function() {
            beforeEach(function(){
                browser().navigateTo('#/collection/shouldnotwork');
            });
            
            it('should be able to be closed by clicking on the close button', function(){
                element('#error-message .error-exit').click();
                expect(element('#error-modal').css('display')).toBe('none');
            });
            
            it('should be able to be closed by navigating to another page', function(){
                element('#navtitle').click();
                expect(element('#error-modal').css('display')).toBe('none');
            });
        });
    });
});
