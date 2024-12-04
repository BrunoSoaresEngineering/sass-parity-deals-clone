import countriesByDiscountGroup from '../data/country-data.json';
import { addCountryGroups as addCountryGroupsDB, getAll } from '../repositories/country-group';
import { addCountries as addCountriesDB } from '../repositories/country';

async function addCountryGroups() {
  const countryGroupData = countriesByDiscountGroup.map(
    ({ name, recommendedDiscountPercentage }) => ({
      name,
      recommendedDiscountPercentage,
    }),
  );

  return addCountryGroupsDB(countryGroupData);
}

async function addCountries() {
  const countryGroups = await getAll({
    columns: {
      id: true,
      name: true,
    },
  });

  const countryData = countriesByDiscountGroup.flatMap(
    ({ countries, name }) => {
      const countryGroup = countryGroups.find((group) => group.name === name);
      if (!countryGroup) {
        throw new Error(`Country group "${name} not found"`);
      }

      return countries.map((country) => ({
        name: country.countryName,
        code: country.country,
        countryGroupId: countryGroup.id,
      }));
    },
  );

  return addCountriesDB(countryData);
}

const groupCount = await addCountryGroups();
const countryCount = await addCountries();

// eslint-disable-next-line no-console
console.log(`Updated ${groupCount} country groups and ${countryCount} countries`);
