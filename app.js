'use strict';

const fs = require('fs');

const parser = require('csv-parse');
const habitablePlanets = new Array();
const filename = 'kepler_dataset.csv';

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

fs.createReadStream(filename)
  .pipe(
    parser.parse({
      comment: '#',
      delimiter: ',',
      columns: true,
    })
  )
  .on('data', data => {
    if (isHabitablePlanet(data)) habitablePlanets.push(data);
  })
  .on('error', err => console.log(err))
  .on('end', () => {
    console.log(`The "${filename}" is parsed succesfully.`);

    console.log(`There are ${habitablePlanets.length} habitable planets.`);

    habitablePlanets
      .map(planet => planet['kepler_name'])
      .forEach(planet => console.log(planet));
  });
