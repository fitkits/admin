$(document).ready(() => {
	'use strict';
	const RazorPaymentWrapper = (paymentDetails, cb) => {
		const options = {
			key: 'rzp_test_EZUc85OddZeYex',
			amount: paymentDetails.amount, // example 2000 paise = INR 20
			name: 'On The Job',
			description: `Purchasing plan ${paymentDetails.planName}`,
			image: '/your_logo.png',
			handler: response => {
				console.log(response.razorpay_payment_id);
				cb(response.razorpay_payment_id);
			},
			prefill: {
				// todo: set account user name
				name: 'Harshil Mathur',
				email: 'harshil@razorpay.com',
				contact: '7358590127'
			},
			notes: {
				address: 'Hello World' // todo
			},
			theme: {
				color: '#32256a'
			},
			modal: {
				ondismiss: () => {
					swal({
						title: 'Attention',
						text: 'You have terminated the payment process in the middle of the way.',
						type: 'warning'
					});
				}
			}
		};
		return window.Razorpay(options);
	};
	window.RazorPaymentWrapper = RazorPaymentWrapper;
});
