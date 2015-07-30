describe("BBN Tool", function() {
	
	describe("page title", function() {
		beforeEach(function() {
			browser.driver.get('http://127.0.0.1:8020/Mareframe-BBN/BBN.html');
			return browser.ignoreSynchonization = true;
			
		})
		
		it("should be BBN Tool", function() {
			expect(bv.getTitle()).toBe("BBN Tool");
		})
	})
	describe("editor mode button", function() {
		beforeEach(function() {
			browser.driver.get('http://127.0.0.1:8020/Mareframe-BBN/BBN.html');
			return browser.ignoreSynchonization = true;		
		})
		
		it("should show the 'new document' button", function() {
			expect(bv.findElement(By.id("newDcmt")).isDisplayed()).toBe(false);
			bv.findElement(By.id("editorMode")).click();
			expect(bv.findElement(By.id("newDcmt")).isDisplayed()).toBe(true);
		})
	})
	//Not working
	// describe("new document", function() {
		// beforeEach(function() {
			// browser.driver.get('http://127.0.0.1:8020/Mareframe-BBN/BBN.html');
			// return browser.ignoreSynchonization = true;		
		// })
		// it("should remove all elements from stage", function() {
			// bv.findElement(By.id("editorMode")).click();
			// bv.findElement(By.id("newDcmt")).click();
			// console.log(bv.executeScript("return document.getElementsByTagName('BBNTool')"));
			// bv.findElement(By.id("BBNTool"));
			// expect(bv.findElement(By.id("BBNTool")).getChildAt(0).getChildAt(0)).toBe(undefined);
		// })
	// })
	
})
