module.exports = {
	db: {
		url: 'mongodb://heroku_b518fcnf:qvjcj84c8istqj4r4lhq0sa2ct@ds161159.mlab.com:61159/heroku_b518fcnf'//mongodb://localhost/uxcoaching'
	},
	auth: {
		coaching_calendar_id: 'uxconsulting.com.sg_nrjfapghj2au0ipie4fre23lqs@group.calendar.google.com',
		GOOGLE_CLIENT_ID: '939512913851-mt4j5iv7gqflnhud1o8egf6r0cs8jmn8.apps.googleusercontent.com',
		TOKEN_SECRET: process.env.TOKEN_SECRET || 'cnLqOQeIXXvuKuQW'
	}
}