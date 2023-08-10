import Fastify from 'fastify'
const fastify = Fastify({
  logger: true
})
import got from 'got';
import NodeCache from 'node-cache';

const appCache = new NodeCache();

fastify.get('/covid', async function (req, res) {
  try {
    let covidAllStats = appCache.get('covidAllStats');

    if (covidAllStats == null) {
      const response = await got('https://disease.sh/v3/covid-19/all');
      covidAllStats = response.body;

      appCache.set('covidAllStats', covidAllStats, 600);
    }

    res
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(covidAllStats);
  } catch (err) {
    fastify.log.error(err);
    res.code(error.response.code).send(err.response.body);
  }
});

fastify.listen({ port: 4000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  fastify.log.info(`server listening on ${address}`);
});
