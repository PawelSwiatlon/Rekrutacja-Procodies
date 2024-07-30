"use strict";


let MainController = {
    $body: $('body'),
    $document: $(document),

    elemnts: {
        sliders_container: null,
        sliders_for: null,
        sliders_nav: null,
        
        contact_form: null,
        submit_contact_form: null,

        toast_container: null,
    },

    SPINNER: '<div class="loader-container"><div class="loader"></div></div>',

    init: function() {
        this.bintElementsController();
        this.eventsController();
        this.slidersMainController();
    },
    bintElementsController: function() {
        this.elemnts.sliders_container = this.$body.find('[data-slider-product="container"]');
        this.elemnts.sliders_for = this.$body.find('[data-slider-product="for"]');
        this.elemnts.sliders_nav = this.$body.find('[data-slider-product="nav"]');

        this.elemnts.contact_form = this.$body.find('[data-contact-form]');
        this.elemnts.submit_contact_form = this.$body.find('[data-contat-form-submit]');

        this.elemnts.toast_container = this.$body.find('[data-simple-toast="container"]');
    },
    eventsController: function() {
        this.elemnts.contact_form.on('submit', function(e){
            e.preventDefault();
            e.stopPropagation();
            MainController.contactFormController();
        });
        this.elemnts.contact_form.find('input').on('blur', function(){
            MainController.contactForInputsController($(this));
        });
    },
    slidersMainController: function() {
        if(!this.elemnts.sliders_container.length) {
            return;
        }

        const paramsForSlider__nav = {
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: this.elemnts.sliders_for,
            dots: false,
            centerMode: false,
            focusOnSelect: true
        };

        const paramsForSlider__for = {
            sslidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: this.elemnts.sliders_nav
        };

        this.elemnts.sliders_for.slick(paramsForSlider__for);
        this.elemnts.sliders_nav.slick(paramsForSlider__nav);
    },
    contactFormController: function() {
        if(!this.validContactFormController(true)) {
            this.simpleToastController('Please complete all required fields');
            return;
        }

        this.elemnts.contact_form.append(this.SPINNER);

        $.ajax({
            url: this.elemnts.contact_form.attr('action'),
            method: this.elemnts.contact_form.attr('method'),
            dataType: "json",
            data: this.elemnts.contact_form.serialize(),
            contentType: false,
            processData: false,
            success: function (response) {
                // TODO -- something what u want todo;)
            }
        });

        // symulate success acction ;)
        setTimeout(function(){
            MainController.simpleToastController('Thank you for submitting the form', 'success');
            MainController.elemnts.contact_form.find('input').val('');
            MainController.elemnts.contact_form.find('.loader-container').remove();
        }, 2000);
    },
    contactForInputsController: function($input){
        if($input.attr('type') == 'email') {
            if(!$input.val().length || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test($input.val())) {
                $input.addClass('invalid');
                this.simpleToastController('Incorrect email address');
                this.validContactFormController();
            } else {
                $input.removeClass('invalid');
            }
            return;
        }

        if($input.attr('type') == 'text') {
            if(!$input.val().length && $input.attr('required')) {
                $input.addClass('invalid');
                this.simpleToastController('Complete the required fields');
                this.validContactFormController();
            } else {
                $input.removeClass('invalid');
            }
            return;
        }

        if($input.attr('type') == 'tel') {
            if(!$input.val().length || $input.val().length < 9) {
                $input.addClass('invalid');
                this.simpleToastController('Incorrect phone number');
                this.validContactFormController();
            } else {
                $input.removeClass('invalid');
            }
            return;
        }
    },
    validContactFormController: function(addClassToOthers = false){
        let isValid = true;

        if(this.elemnts.contact_form.find('input').hasClass('invalid')) {
            isValid = false;
        } else {
            this.elemnts.contact_form.find('input').each(function(){
                if(!$(this).val().length && $(this).attr('required')) {
                    if(addClassToOthers) {
                        $(this).addClass('invalid');
                    }
                    isValid = false;
                }
            });
        }
        
        this.elemnts.submit_contact_form.prop('disabled', !isValid);
        return isValid;
    },
    simpleToastController: function(message, toastType = 'error') {
        let messageParagraph = document.createElement("p");
        let messageNode = document.createTextNode(message);
        
        messageParagraph.appendChild(messageNode);
        messageParagraph = $(messageParagraph);

        this.elemnts.toast_container.append(messageParagraph);

        setTimeout(() => {
            if(toastType == 'success') {
                messageParagraph.addClass('success');
            }
            messageParagraph.addClass('show');
        }, 100);
        
        setTimeout(() => {
            messageParagraph.removeClass('show');
        }, 5000);

        setTimeout(() => {
            messageParagraph.remove();
        }, 10000);
    }
};

$(document).ready(function () {
    MainController.init();
})