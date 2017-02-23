module.exports = {
	db: {
		url: 'mongodb://heroku_b518fcnf:qvjcj84c8istqj4r4lhq0sa2ct@ds161159.mlab.com:61159/heroku_b518fcnf'//mongodb://localhost/uxcoaching'
	},
	auth: {
		coaching_calendar_id: 'uxconsulting.com.sg_nrjfapghj2au0ipie4fre23lqs@group.calendar.google.com',
		GOOGLE_CLIENT_ID: '939512913851-mt4j5iv7gqflnhud1o8egf6r0cs8jmn8.apps.googleusercontent.com',
		TOKEN_SECRET: process.env.TOKEN_SECRET || 'cnLqOQeIXXvuKuQW',
		RECAPTCHA_SECRET: process.env.RECAPTCHA_SECRET || '6LfWvSUTAAAAACvjJmSniErbB4bK9leVZjAiZ1ai',
		FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || '3819e19fc65f6d5ae26461c13721c908',
		LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'UFKNZqm1XWqtCsws',
		GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'YwjZDLvlYnDtpt_yZqW20weF'
	},
	email: {
		SENDGRID_KEY: process.env.SENDGRID_KEY || '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',
		string: 'smtps://davidchoo16%40gmail.com:pass@smtp.gmail.com'
	},
	timekit: {
		
	}
}