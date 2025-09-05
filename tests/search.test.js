import { setActivePinia, createPinia } from "pinia";
import { useDictionaryStore } from "~/store/index.js";

function search(query) {
  const store = useDictionaryStore();
  store.updateSearchQuery(query);

  return store.searchResults;
}

beforeEach(() => {
  setActivePinia(createPinia());
});

test("search words including 'ヴァヴィヴヴェヴォ' by 'ばびぶべぼ'", () => {
  const results = search("ベル・ゴレット");
  expect(results).toHaveLength(1);
  expect(results[0].ja).toBe("ヴェル・ゴレット");
});

const fixtures = [
  {
    result: "Geo Archon",
    input: "Geo God",
    lang: "en",
  },
  {
    result: "神里綾華",
    input: "神里綾香",
    lang: "ja",
  },
  {
    result: "神里绫华",
    input: "神里凌华",
    lang: "zhCN",
  },
];

for (const { result, input, lang } of fixtures) {
  test(`search by variants (${lang})`, () => {
    const results = search(input);
    expect(results).toHaveLength(1);
    expect(results[0][lang]).toBe(result);
  });
}

test("order-based searches", () => {
  const store = useDictionaryStore();
  store.setLocale("ja");
  store.updateSearchQuery("神");
  store.maxWords = 1000;

  const results = store.searchResults;
  const resultTitles = results.map(word => word.ja);

  expect(resultTitles.indexOf("「神骨の蛇姫」")).toBeLessThan(resultTitles.indexOf("エゲリア"));
});

test("search words including 'ヴァヴィヴヴェヴォ' by 'ばびぶべぼ' (2)", () => {
  const results = search("べりみる");
  expect(results).toHaveLength(1);
  expect(results[0].ja).toBe("ヴェリミル");
});
