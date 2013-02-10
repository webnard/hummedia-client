'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('hummedia app', function() {

  beforeEach(function() {
    browser().navigateTo('../../app/index.html');
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
});
