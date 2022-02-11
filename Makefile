
all: install

clear:
	@rm -rf uploadfiles
	@rm -rf node_modules

publish:
	@rm -rf uploadfiles
	@rm -rf node_modules
	@npm set registry https://registry.npmjs.org
	@npm publish

install:
	@npm set registry https://registry.npmmirror.com
	@npm install
	
update:
	@npm set registry https://registry.npmmirror.com
	@npm update