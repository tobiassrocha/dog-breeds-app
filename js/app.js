define(['jquery'], function ($) {
	'use  strict';

	return {
		onLoad: function () {
			var self = this;

			// open menu
			$('.js-list-dogs').on('click', function () {
				self.menuListDogs();
			});

			// Load All Google Fonts and slice first 5 fonts
			self.loadFonts("AIzaSyCaSl95k6AXycPoFLA4Fl87FCy_R0RIkmg");

			// Apply fonts in select name dog
			$(".js-select-fonts").change(function () {
				self.applyNewFontSelected(this);
			});

			// Apply color in select name dog
			$(".js-select-color").change(function () {
				var color = $(".js-select-color").val();
				self.changeColor(color);
			});

			// Call the Dog API
			self.getBreeds();

			// Alter default image when selected dog breed
			$(".js-select-breed").change(function () {
				var dogBreed = $(".js-select-breed").val();
				self.getImage(dogBreed);
			});

			// Change name dog
			$(".js-input-name").change(function () {
				var dogName = $(".js-input-name").val();
				$(".js-title-dog").text(dogName);
			});

			// Reset form
			$(".js-reset-form").click(function () {
				self.resetForm();
			});

			// Save dog
			$(".js-save-form").click(function () {
				var dog_name = $(".js-input-name").val();
				var dog_breed = $(".js-select-breed").val();
				var dog_font = $(".js-select-fonts").val();
				var dog_color = $(".js-select-color").val();
				var dog_image = $(".js-image-dog").attr("src");
				var notifications = $(".js-notifications");

				if (dog_name !== '' && dog_breed !== 'default' && dog_font !== 'default' && dog_color !== 'default') {
					self.registerDog(dog_name, dog_breed, dog_font, dog_color, dog_image);

					notifications.text('Success! Dog added!');
					notifications.removeClass('notifications-error');
					notifications.addClass('notifications-success');

					setTimeout(function () {
						notifications.removeClass('notifications-success');
					}, 2000);
				} else {
					notifications.text('Sorry, dog not added');
					notifications.removeClass('notifications-success');
					notifications.addClass('notifications-error');

					setTimeout(function () {
						notifications.removeClass('notifications-error');
					}, 2000);
				}
			});

			// Load Dogs saved on localStorage
			self.loadStorageDogs();
		},

		// open and close menu list dogs
		menuListDogs: function () {
			var list = $('.section.content-right');
			var menu = $('.menu');

			menu.toggleClass('open');
			if (menu.hasClass('open')) {
				$(list).animate({ left: '0' });
			} else {
				$(list).animate({ left: '-100%' });
			}
		},

		// loading google fonts in select
		loadFonts: function (api_key) {
			$.ajax({
				url: 'https://www.googleapis.com/webfonts/v1/webfonts?sort=style&key=' + api_key,
				success: function (success) {
					// populate fonts select input
					success.items = success.items.slice(0, 5);
					$.each(success.items, function (fonts, font) {
						var font_item = '<option value="' + font.files.regular + '">' + font.family + '</option>';
						$('.js-select-fonts').append(font_item);
					});
				}
			});
		},

		// Change Font Dog Name on select change
		applyNewFontSelected: function (item) {
			new_font_src = $(item).find("option:selected").val();
			new_font_name = $(item).find("option:selected").text();

			new_font = new FontFace(new_font_name, 'url(' + new_font_src + ')');
			new_font.load().then(function (font_loaded) {
				document.fonts.add(font_loaded);
			}).catch(function (error) {});

			$('.js-input-name').css('font-family', new_font_name);
			$('.js-title-dog').css('font-family', new_font_name);
		},

		// Change Font Dog Name color on select change
		changeColor: function (color) {
			$('.js-input-name').css('color', color);
			$('.js-title-dog').css('color', color);
		},

		// Get all breeds
		getBreeds: function () {
			$.ajax({
				url: "https://dog.ceo/api/breeds/list/all",
				success: function (result) {
					var breeds = result.message;

					$.each(breeds, function (dog, breed) {
						// Populate Sub Breeds
						if (breeds[dog].length >= 1) {
							for (i = 0; i < breeds[dog].length; i++) {
								$(".js-select-breed").append('<option value="' + dog + '-' + breeds[dog][i] + '">' + breeds[dog][i] + ' ' + dog + '</option>');
							}
						}

						// Populate Parent Breeds
						else if (breeds[dog].length < 1) {
								$(".js-select-breed").append('<option value="' + dog + '">' + dog + '</option>');
							}
					});
				},
				error: function (result) {
					$(".js-select-breed").html('<option value="erro">Sorry, we got a problem :(</option>');
				}
			});
		},

		// Get image dog
		getImage: function (dogBreed) {

			if (dogBreed.indexOf('-') > -1) {
				dogBreed = dogBreed.replace('-', '/');
			}

			$.getJSON("https://dog.ceo/api/breed/" + dogBreed + "/images/random", function (result) {
				$(".js-image-dog").attr("src", result.message);
				$(".js-image-dog").animate({ opacity: '0.25' }, 400);
				$(".js-image-dog").animate({ opacity: '0.5' }, 600);
				$(".js-image-dog").animate({ opacity: '0.75' }, 800);
				$(".js-image-dog").animate({ opacity: '1' }, 1000);
			}).fail(function (result) {
				$(".js-image-dog").attr("src", "./images/dog-image.jpg");
			});
		},

		// Reset fields from form new dog
		resetForm: function () {
			$('.js-select-breed').val('');
			$('.js-input-name').val('');
			$('.js-select-fonts').val('');
			$('.js-select-color').val('');
			$('.js-title-dog').text('Dog name');
			$('.js-title-dog').css('color', '#000000');
			$('.js-image-dog').attr("src", "./images/dog-image.jpg");
		},

		// Save dog in localStorage
		registerDog: function (new_name, new_breed, new_font, new_color, new_image) {
			var list_dogs = localStorage.getItem("listDogs");
			var date_hour = new Date();
			date_hour = date_hour.toLocaleString("pt-BR");

			arr_dog = {};
			arr_dog = {
				name: new_name,
				breed: new_breed,
				font: new_font,
				color: new_color,
				image: new_image,
				date_hour: date_hour
			};

			!list_dogs ? list_dogs = [] : list_dogs = JSON.parse(list_dogs);

			list_dogs.push(arr_dog);
			localStorage.setItem("listDogs", JSON.stringify(list_dogs));

			this.loadStorageDogs();
			this.resetForm();
		},

		// load dogs saved on local storage
		loadStorageDogs: function () {
			// Get Dogs from Local Storage
			var local_dogs = JSON.parse(localStorage.getItem("listDogs"));

			if (!local_dogs) {
				$(".js-local-empty").fadeIn();
				return false;
			}

			if (local_dogs.length && typeof local_dogs !== 'undefined') {
				$(".js-local-empty").css("display", "none");

				// Remove old dogs to update
				$(".list-dogs-item[data-index]").fadeIn(300);
				setTimeout(function () {
					$(".list-dogs-item[data-index]").remove();
				}, 320);

				// Show all dogs in local storage
				setTimeout(function () {
					$.each(local_dogs, function (index, dog) {
						var data_storaged = $(".list-dogs--demo").clone();
						data_storaged.removeClass("list-dogs--demo");
						data_storaged.attr("data-index", index);
						data_storaged.css("opacity", "0");
						data_storaged.find("img").attr("src", dog.image);
						data_storaged.find("img").attr("dog-breed", dog.breed);
						data_storaged.find(".list-dogs-name").text(dog.name);
						data_storaged.find(".list-dogs-name").css("color", dog.color);
						data_storaged.find(".list-dogs-name").css("font-family", dog.font);

						if (dog.breed.indexOf("-") > -1) {
							dog.breed = dog.breed.replace("-", ' ');
						}
						data_storaged.find(".list-dogs-breed").text(dog.breed);
						data_storaged.find(".list-dogs-date").text(dog.date_hour);

						// Show items in fade effect
						$(".list-dogs").append(data_storaged);
						setTimeout(function () {
							$(".list-dogs-item[data-index='" + index + "']").css("opacity", "1");
						}, 550 * index);
					});
				}, 350);
			} else {
				$(".js-local-empty").fadeIn();
			}
		}
	};
});