import React from 'react';
import './Contact.css';
const Contact = () => {
    return (
        <div className="contact-container">
            <h4>Связаться с нами</h4>
            <p>Вы можете найти нас в следующих социальных сетях:</p>
            <div className="social-links">
                <a href="https://www.facebook.com/chikoworldkitchen" target="_blank" rel="noopener noreferrer">
                       <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" />
                </a>
                <a href="https://wa.me/905326916252" target="_blank" rel="noopener noreferrer">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
                </a>
                <a href="https://www.instagram.com/chikorestaurant/" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" />
                </a>
            </div>
        </div>
    );
};

export default Contact;