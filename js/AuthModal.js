import {Modal} from "./classes.js";

export class AuthModal extends Modal {
    constructor() {
        super();
        this.div = document.createElement('div');
        this.loginTemplate();
        this.hide = this.hide.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    loginTemplate() {
        this.div.classList.add('login-modal');
        this.div.innerHTML = `
        <div class="login-modal__header">
            <button class="header__close-btn">Close</button>
        </div>
        <h2 class="login-modal__title">Log in</h2>
        <p class="login-modal__text">login here using your e-mail and password</p>
        
        <form class="login-modal__form">
            <input type="email" id="email" placeholder="e-mail" required>
            
            <input type="password" name="password" id="password" placeholder="password" required>
            
            <button type="button" class="form__sign-btn">Sign up</button>
            <button type="submit" class="form__submit-btn">Log in</button>
            
        </form>
        `;
    }

    show() {
        const emailInput = this.div.querySelector('#email');
        const closeButton = this.div.querySelector('.header__close-btn');
        const loginButton = this.div.querySelector('.form__submit-btn');
        const signUpButton = this.div.querySelector('.form__sign-btn');

        closeButton.addEventListener('click', this.hide);

        signUpButton.addEventListener('click', () => {
            window.location.href = "https://ajax.test-danit.com/front-pages/cards-register.html";
        });

        emailInput.addEventListener('input', (event) => {
            if (!this.validateEmail(event.target.value)) {
                alert('Enter a valid e-mail');
            }
        });

        loginButton.addEventListener('click', this.handleLogin);

        document.body.appendChild(this.div);
    }

    validateEmail(email) {
        const EMAIL_REGEXP =
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        return EMAIL_REGEXP.test(email);
    }

    handleLogin(event) {
        event.preventDefault();

        const email = this.div.querySelector('#email').value;
        const password = this.div.querySelector('#password').value;

        fetch("https://ajax.test-danit.com/api/v2/cards/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        })
            .then(response => {
                if (response.status !== 200) {
                    alert('Wrong e-mail or password');
                    throw new Error('Invalid credentials');
                }

                return response.text();
            })
            .then(response => {
                document.querySelector('.main').classList.toggle('main--hidden');
                const navButtons = document.querySelectorAll('#authButton, #signUpButton, #createVisitButton, #logOutButton');
                navButtons.forEach(btn => btn.classList.toggle('button--hidden'));
                this.hide();
            }).catch(error => {
            console.error('Login failed:', error.message);
        });
    }

    hide() {
        this.div.remove();

        const closeButton = this.div.querySelector('.header__close-btn');
        const loginButton = this.div.querySelector('.form__submit-btn');

        closeButton.removeEventListener('click', this.handleLogin);
        loginButton.removeEventListener('click', this.hide);
    }
}