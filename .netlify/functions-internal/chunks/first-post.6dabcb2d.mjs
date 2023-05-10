import { l as createVNode, s as spreadAttributes, F as Fragment } from './astro.ef17a847.mjs';
import 'cookie';
import 'kleur/colors';
import 'slash';
import 'path-to-regexp';
import 'mime';
import 'html-escaper';
import 'string-width';

const images = {
					
				};

				function updateImageReferences(html) {
					return html.replaceAll(
						/__ASTRO_IMAGE_="(.+)"/gm,
						(full, imagePath) => spreadAttributes({src: images[imagePath].src, ...images[imagePath].attributes})
					);
				}

				const html = updateImageReferences("<h1 id=\"my-first-post\">My First Post</h1>\n<p>Welcome to my website and blog. Here will be posting about my projects and other things I find interesting. I hope you enjoy your stay!</p>\n<h2 id=\"information\">Information</h2>\n<p>This website is built with</p>\n<ul>\n<li><a href=\"https://astro.build\">Astro</a></li>\n<li><a href=\"https://tailwindcss.com\">TailwindCSS</a></li>\n<li><a href=\"https://svelte.dev\">Svelte</a></li>\n</ul>\n<h2 id=\"why-i-made-this-website\">Why I made this website</h2>\n<p>I wanted to showcase my skills in frontend development along with providing myself with a platform that I can use to share my thoughts and ideas. I also wanted to learn more about Astro and Svelte, so this was a great opportunity to do so.</p>");

				const frontmatter = {"draft":false,"title":"My First Post","snippet":"Welcome to my website and blog.","image":{"src":"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBQREhISExISEhgUEhgSEhcSERQaExQVGBUaGRoUGBUbIS0kGx0tHxgVJkUlLy4xNDY0GiQ6QzozPi0zNjEBCwsLEA8QHxISHzQrJCszMzY5NzMzMzwzNTM8NTw1OTw1NDM8MzMzOTUzPTMzMzMxMzMzMzM2MzMzMzMzMzMzM//AABEIAOEA4QMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAwUGBAIHAf/EADkQAAIBAgUBBgQEBQMFAAAAAAABAgMRBAUSITETIjJBUWGBBiNxkUKhscEUUnKC0TOi8AdTYrLh/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAEDBAUC/8QAKxEBAAIBAwIEBQUBAAAAAAAAAAECEQMhMRJBUWFxgQSRoeHwEyIyscHR/9oADAMBAAIRAxEAPwD7MAAAAAAAAAAAAAAAAAAAAAgjfVy+WTkNPvMmAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEdSVtgJDy5LzRyymeHVAng9+SZSXmcKrfT7nrrebS+pGR3AgoTv+xOSAAAAAAAAAAAAAAAAAAAAAAAAABD1fJfmBMCF1X6Hl1n6ATN2OapM8zqepzYnFxpxc5SUYpXbfCImR+1qqSbbskrtvhW8T57meb9bFRlVc6dBPZWkpVIKOpSS8pX58md+e5zObpKDUKMtEpSk+3UU7228I8Pz4K+l8NuvpqzqNJxvTcbtqKaS2fN42RnnUi04jj8hu06W0Yi+cTPziN9485xjy+cLOVHDznDFRlrjoUYQhZQglfZvz342OnNqznhFJSbfUWmUX20tW625srr2M28srKpKgqsafy5VYpLWra7Rg1soze17XX1LHNJtOGEipVHTpw1JNKU5yvqV7qzaT327xX0TMzM4aaxpzqVrFpnG+/GOfs3ORybo0G3dujBt+b0LctisyymowpxirKNNRivJKOyLM114hyrTm0z5gAPTyAAAAAAAAAAAAAAAAAAAAAPM+H9GcMpHdPh/RlfJgQYrFxpq8r+yv7WOevmdOnFTm3GLV7v9Gv+cFb8UYyVCNKonBRjOWvUvwuDtbyd7GHxWeQr4WVOTlGaxDlSUlJ6oS3k9b25lPbwtYom1uqYatPQi0Vme848/l5f63eZZrONKrOG1oRcOz2nObaWz/t8PEoMjniaz6lSpLpzU5dqSk01slp/DHb0PMsdSxNCmqjqqUtCk6fgob3txa91e3j6EEc06U6Sw8Lxt0XTtbXu0r7byd07+pXqRW37bb+TToaGtETEUiNuZj+p7LnAU1KtGompxp4e2pW0uaaWy+5+YupOnacJRhQjBU3KSfUpWu5Sjdbp9hXZX0M6ccR/D1IqhC+mScVK02rqKcX2Yu63Zb5hqdOTpwjUU59OSlO0XBx2erfhvy8WV0pNNPpmcc/9U6ts3jG8fnPmxssbOVeXTU5p3aSjJ3jy91vfa9/oT/wlVYjqzjKNNR6k3Oom3UteK5v+Lf6HFh5VMJOFSF4ztKlNycpR1x3kmm907Lf6Grx8lOk5TpQhUVOFao4SWmS8YNct2TW6t6llJjHVG7fM3jojWiuJmN48piYznHG2ZbHJr9KldWfShdeT0K6LUrMoqa6dOdktVKMrLhXinb8yzNUOJM5kABKAAAAAAAAAAAAAAAAAAAAAB5krprzRWTdnZq31LU8tX5AzmZZfSxKjGrHXGMlNLU0rpNK9ueTiWQYROL6EG4q0dV5Wv9X6s1/Sj/LH7I/UrcEYInE5Zull1OKtGjBWVlakuPLgmjhVC1qaj5dhI0By4xce/wCww9Te08yrUio+I8ROnStTpznKo+nHRzB2bU/a1/YupIq88rONNRhONOpUlooymrxU7X7XpZNe9uWjzaMwmk4tE4YvEYtdSMpRU0tV1UjDS2uWkvRNL12LjNMJJwU27akm4qn20pLSlN32SuvsQUMJOliIurCnUUrWepJSnfVqS/qs7eZ25lJzVSMouUYvtJ6o65qStFvlLa5i/TpTEzHHH5w63xlf1oiunjeOfpiPdrsljppUl5UoL7QRalfl1tMbKy0KyXgrLYsDfDjAAJAAAAAAAAAAAAAAAAAAAAAAAAAAADnxa2R0HPi+F9QOCZnPirL1iVSp63By1qNoar91tW/tNLIz/wAU5j/DQjJalJyai1a3G97+G5Trfw2X6FJveKx3U0cpqOqoqSTioyUm2orTK6Si/U6swxUIWc3PRKs3KFrSTULNNre2zf7mYr5/jH86nF6W1QdRwTitW6S4Wq/j6r0JcBj+viISmrqMpSS3cYtQa1tPhuTf2RmvW/THfvPG/l7uhbV1LakdccT0xjx5nE+m+eY931bLmrR08aFb6WViwK/LntH+hcccIsDfDkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAc+K4X1OggxPd9wOGZV5tQpTinVjCSheSc4pqPF36eBaTKfOswjQUHJSlrbhGKtZy2sn6cld5xGVmlWbWxXlnMJg5Sw2JpSkqadb5Uppxe2ntaGuGlG31ZWZVSw9KSjVqRoxu6mipbVUcZWlGfrtskdmLxtLEOvvNONJylWklemk+zpi+HdN+z5MrFOvatBrqTcoSdR7U5K71r+1f7jJp6vVnaYxjn0zH56eMOtW1+uad5jM45jiNo5nMeno+45dJNRcVZOCcdrbNK2xYFVkj+VS3T+VDdcPsrdFqb4cUAAAAAAAAAAAAAAAAAAAAAAAAAAAAACDE933JyDE933A4JmY+LqigsPUcXJU699MV2neLW33uaeZmvjGSVKnJ2uqqcb8N2f8A9Kdb+EtXwderWrWe+f6Z2qqalpUUlUqPqRVvmOKcryfitTa9iuzeliJOinRVOLj8tqK6UE7b34b8bc/qflLFpzw8ppwjqanJp2tdqUl/N3jQVcyiqcqFFQcUlTSqJyiqeiycfFva++xmrpRFsz4Rj1xv9MOprVvW0RpRmcc+/jxnP5Dc5J/pUbO/yYb+fYjuWxT5BG1GgvLD00vaES4N0ODMY2kABIAAAAAAAAAAAAAAAAAAAAAAAAAAAQYnu+5OQYnu+4HBMzPxjh5TpU9KUrVe1F/iTpzjaK87tGnmVecYtUaeuybvaKk7XlZ2X5Fd7RFZmVmnETaImM+XGffs+d55gcRGjRqVZQSiowhFcx7VnF+F3t9vc1OBwcaOHp0ovpyqUVeTi9bqOOpxlttHvbeByYfHOctVWFJQqTjGNOdtHWXack7crTqvbmP1Lb+Npzn8ucJzSWlanojKV7xnNXsva/5GW1pmf2+OJ9P93dDUm9K9E9vDj37befLR5F/o0b/9mF7cdyJbFfl9uza1tG1uLbcFgbY4cy05mZAASgAAAAAAAAAAAAAAAAAAAAAAAAAAAgxPd9ycgxXd9wOCZnviydqME79qpb6NU5yT/wBpoJldm9BThpcXJXTaXp+hVq26aTK/4a0V1a2ntLC1Zxr4ejToTalGep61Z3jHtPfnvfmesJUlLXQUdU5xainKyhp7UpSt3lbj6r2/cyqR61CToanZxgod21nZWW+qPNl68lLgcXKGIfTlOL6kLylZylCo1F95cWTMWhzOOJ393VittXSvS0bTmY39fu+xZBBxpUou940Yp35uox5Lc4cC7u//AI/4O46ThRwAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAIMV3X7fqTkOJ7j9v1QFbNlF8U1PlQj1HSU5qMpLay0ylZvwTcUvcvJGf+LlHoRlO+iFWE5WtvBX1R381de5VqV6qTELdGLdcdPL5/hMzq4aClKGqPWc6Dk+1JQqWloW7Skrq9ttTNPhssjiVQrzovD9OeqnTpwjeUW4z11Jvbdp7O3u2VVLC0ZzpYqM4U8P1L043UY9S2rppNb9pPbi90aPLJutTcalS96lWKUU42hZyTe+7V7X4M0WrW81iMd/fj7yvtqX1I6rRjfGYy2mWv8A9f8ABYFRkMXGlTTSTVKCaXCaitl6FubazmGSYxOAAEoAAAAAAAAAAAAAAAAAAAAAAAAAAAIMV3Je36onOetWSvG2rbdXArWzKf8AUGWnCNttJVY3Sb7WztF25V7bGqnzsrel7lXnWX/xNJ09Kd2mtSdrrzsV34XaForqRPn3fJ44+fQpRlUsoKbpQjCOpTvq7S8IXbV+fuX+TZhDROVScabdOM6am2+1K0tku94bFtS+BoarzlqWlJJ+Flze/wCR2r4Jwzt1HOSi7qPUaS2tbbe3pcrtTqjEw1W1qUiYpbmYziJ+nfPrnO7V/DWK61ClUat1KNOdvLVG9i6KPCQjTjCME2oRUYqN3ZJWS2Lei24ptNP155L68YYLc7JQASgAAAAAAAAAAAAAAAAAAAAAAAAAAAgrYdS33T81/gnAFe8HL+dfZ3+xWOpJ+RozPtECCTl5smypXrWe/wAuXO+947/qRyJMrfz4/wBMv2CYaEAEoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADPzNAUWOoOEm7PS900tlfwfkRI5psZRviV6Qk/0X7niMJTdoRcv6V+r4RbZXl/S1TlZykktuIxX4V/zy8gmFmACUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2Q==","alt":"A picture"},"publishDate":"2022-04-10 9:00","category":"Development Blog","author":"Joshua La","tags":["webdev","frontend"]};
				const file = "/Users/joshuala/Projects/portfolio/src/content/blog/first-post.md";
				const url = undefined;
				function rawContent() {
					return "\n\n# My First Post\n\nWelcome to my website and blog. Here will be posting about my projects and other things I find interesting. I hope you enjoy your stay!\n  \n\n  \n\n## Information\n\nThis website is built with \n- [Astro](https://astro.build)\n- [TailwindCSS](https://tailwindcss.com)\n- [Svelte](https://svelte.dev)\n  \n\n\n\n## Why I made this website\n\nI wanted to showcase my skills in frontend development along with providing myself with a platform that I can use to share my thoughts and ideas. I also wanted to learn more about Astro and Svelte, so this was a great opportunity to do so.\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"my-first-post","text":"My First Post"},{"depth":2,"slug":"information","text":"Information"},{"depth":2,"slug":"why-i-made-this-website","text":"Why I made this website"}];
				}
				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return contentFragment;
				}
				Content[Symbol.for('astro.needsHeadRendering')] = true;

export { Content, compiledContent, Content as default, file, frontmatter, getHeadings, images, rawContent, url };
