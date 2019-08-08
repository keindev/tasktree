# BREAKING CHANGES

-   **[Task]** Add never to fail method [`9949e74`](https://github.com/keindev/tasktree/commit/9949e74cf7ba83fa6ef63acf11ced348c7129fda)

# Important Changes

## Engines

-   Added **node** with `>=10.0.0`

## License

Source code now under `MIT` license.

## Dependencies

-   Added **[chalk](https://www.npmjs.com/package/chalk/v/2.4.2)** with `^2.4.2`
-   Added **[color-convert](https://www.npmjs.com/package/color-convert/v/2.0.0)** with `^2.0.0`
-   Added **[elegant-spinner](https://www.npmjs.com/package/elegant-spinner/v/2.0.0)** with `^2.0.0`
-   Added **[figures](https://www.npmjs.com/package/figures/v/3.0.0)** with `^3.0.0`
-   Added **[stdout-update](https://www.npmjs.com/package/stdout-update/v/1.3.5)** with `^1.3.5`

## DevDependencies

-   Added **[@types/color-convert](https://www.npmjs.com/package/@types/color-convert/v/1.9.0)** with `^1.9.0`
-   Added **[@types/jest](https://www.npmjs.com/package/@types/jest/v/24.0.17)** with `^24.0.17`
-   Added **[@types/node](https://www.npmjs.com/package/@types/node/v/12.7.1)** with `^12.7.1`
-   Added **[@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin/v/1.13.0)** with `^1.13.0`
-   Added **[@typescript-eslint/parser](https://www.npmjs.com/package/@typescript-eslint/parser/v/1.13.0)** with `^1.13.0`
-   Added **[changelog-guru](https://www.npmjs.com/package/changelog-guru/v/0.10.0)** with `^0.10.0`
-   Added **[eslint](https://www.npmjs.com/package/eslint/v/6.1.0)** with `^6.1.0`
-   Added **[eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base/v/13.2.0)** with `^13.2.0`
-   Added **[eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier/v/6.0.0)** with `^6.0.0`
-   Added **[eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import/v/2.18.2)** with `^2.18.2`
-   Added **[eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest/v/22.15.0)** with `^22.15.0`
-   Added **[husky](https://www.npmjs.com/package/husky/v/3.0.3)** with `^3.0.3`
-   Added **[jest](https://www.npmjs.com/package/jest/v/24.8.0)** with `^24.8.0`
-   Added **[npm-run-all](https://www.npmjs.com/package/npm-run-all/v/4.1.5)** with `^4.1.5`
-   Added **[prettier](https://www.npmjs.com/package/prettier/v/1.18.2)** with `^1.18.2`
-   Added **[strip-ansi](https://www.npmjs.com/package/strip-ansi/v/5.2.0)** with `^5.2.0`
-   Added **[ts-jest](https://www.npmjs.com/package/ts-jest/v/24.0.2)** with `^24.0.2`
-   Added **[typescript](https://www.npmjs.com/package/typescript/v/3.5.3)** with `^3.5.3`

# Features

## Progress Bar

-   Add Progress bar [`30926e1`](https://github.com/keindev/tasktree/commit/30926e1995144c2168ecabd1ccbca5494cd64d13)
-   Add ProgressBar rendering [`abeccbc`](https://github.com/keindev/tasktree/commit/abeccbc66e3c8ac841614f247ea6d2c1a8eeaae1)
-   Add badge, status & gradient to progressbar [`b90916c`](https://github.com/keindev/tasktree/commit/b90916c3b4227e3569ecc4c626a12a0e9eb05a4d)
-   Fix rendering bugs, theme [`ce9468c`](https://github.com/keindev/tasktree/commit/ce9468cb901e5b492c52a2c99612fa9d80673d34)
-   Add test for Progress bar [`ef1d090`](https://github.com/keindev/tasktree/commit/ef1d090af0e57e703469bac5749394c13c2ee47d)

## StackTrace errors in tree

-   Add method for add ErrorObj & string errors [`e8fcfd4`](https://github.com/keindev/tasktree/commit/e8fcfd470c2fe5ad560b5e90a9c6a8b2498d2bb6)
-   Add Template for task rendering [`ff97fe2`](https://github.com/keindev/tasktree/commit/ff97fe2ab32a646faf366f70130adfc9c88479bd)
-   **[Template]** Tree render, tasks structure [`7224b44`](https://github.com/keindev/tasktree/commit/7224b4465089a05e86a9e43b32a5a10592e9eb5c)
-   Lint free [`e772566`](https://github.com/keindev/tasktree/commit/e772566712f59dced8ccf4920c7425585038608d) [`1141c31`](https://github.com/keindev/tasktree/commit/1141c3117484b6842f5f55d21d85ab310256ab08)
-   Add enums for Colors & Badges [`68d1dc5`](https://github.com/keindev/tasktree/commit/68d1dc5f3a4cd4a34ca90e8bb3de6928f980a5a8)
-   Add tests for Task & Template [`d6b5b9e`](https://github.com/keindev/tasktree/commit/d6b5b9eb866c5015b2673e0f2c6eb17c647c2b1b)
-   Render Task with Template [`42ea386`](https://github.com/keindev/tasktree/commit/42ea386012dbbd89afc45fa6eecae7f30ce4c697)

## Others

-   Add lib struct, remove module from changelog\-guru [`6abded1`](https://github.com/keindev/tasktree/commit/6abded1eb4245cf720c1fcf51b4df25da90d2194)
-   Add a clear for task [`87fa2e7`](https://github.com/keindev/tasktree/commit/87fa2e7ea22c12529876bd3683dfb56e96d75d64)

# Improvements

-   **[TaskTree]** Improve fail method [`6f453c6`](https://github.com/keindev/tasktree/commit/6f453c6ea05074ebd1aa5f1a80c151e11d087018)

# Bug Fixes

-   **[Eslint]** Fix eslint config [`f65aae4`](https://github.com/keindev/tasktree/commit/f65aae4f37a7f8d2c643cf99eb4b22bc25bee348)
-   **[Test]** Fix snapshot \(strip ansi\) [`d8d26ad`](https://github.com/keindev/tasktree/commit/d8d26ada7e1d054681f9efb07f0b9402048f5326)
-   Fix tsconfig [`7c86a16`](https://github.com/keindev/tasktree/commit/7c86a1699d1ae5daf1df5344e6aa4f7c6fa4147d)
-   \.travis conf [`789e816`](https://github.com/keindev/tasktree/commit/789e81683f9b62329695245c432ff8a190e29246)
-   Change name to tasktree\-cli [`837e1c0`](https://github.com/keindev/tasktree/commit/837e1c0bffb8d3b67a3ddfcdf6b1136f2a5e4b39)
-   Security & lint errors [`dfbf99a`](https://github.com/keindev/tasktree/commit/dfbf99a53c73e10384b190eaa76e5c4e054801fd)
-   Fix codacy issue [`953b8dc`](https://github.com/keindev/tasktree/commit/953b8dcf8db183282e2debe3d762698806ed2dbc)
-   Change theme options struct [`4f554b0`](https://github.com/keindev/tasktree/commit/4f554b0127a99430908a9a29fc7de81543a8644a)
-   Split stop to stop & exit methods [`7a3311f`](https://github.com/keindev/tasktree/commit/7a3311ff8b01a9a9517d27834afbee4059ba648c)
-   Replace log\-update with stdout\-update [`ba3dd79`](https://github.com/keindev/tasktree/commit/ba3dd79c75b5a810fb6c77f4aff116f8c10c3bb6)
-   Fix output tree, after update stdout\-update [`9166f96`](https://github.com/keindev/tasktree/commit/9166f96ff99422620ca862cd6f667371b71530bc)

# Internal changes

-   **[Changelog]** Generate changelog [`82fe258`](https://github.com/keindev/tasktree/commit/82fe258c69acb007725e570ea067e7087fd68581)
-   **[Media]** Update logo [`57d68d4`](https://github.com/keindev/tasktree/commit/57d68d470343a3c4ad47276ff63bf8ab46f3fb6c)
-   **[Package]** Update dependencies [`a38eaf0`](https://github.com/keindev/tasktree/commit/a38eaf08027a79913b8f28387a6038cb5d3166c7) [`a4600b6`](https://github.com/keindev/tasktree/commit/a4600b67264cbff72a165bfbccb2d3db4ffde53c) [`a5ad40c`](https://github.com/keindev/tasktree/commit/a5ad40c52bdc1b65994e544233f9583c47ee978e) [`0fe9d5e`](https://github.com/keindev/tasktree/commit/0fe9d5e1e08c2e7aba172b71b2aa4e7d04ee9495) [`f9be4c5`](https://github.com/keindev/tasktree/commit/f9be4c5781388acada75c918bf2ae1cd2530e951) [`4c6f304`](https://github.com/keindev/tasktree/commit/4c6f3047c62693e2e1a1c52e5329fbb6ff019096)
-   **[Package]** Update critical dependencies [`7abf96e`](https://github.com/keindev/tasktree/commit/7abf96eb547ce251ea68b86b35872da5fd1bf28b)
-   **[Readme]** Describe usage section for TaskTree [`d586196`](https://github.com/keindev/tasktree/commit/d5861969f73011cafe4043eb9b43e0cd310caf44)
-   **[Readme]** Fix codacy issue, correct func desc [`c0dffd0`](https://github.com/keindev/tasktree/commit/c0dffd0afb02f047f518963ab49b20b248c7f7e3)
-   **[Readme]** Add description to "Task" section [`381623f`](https://github.com/keindev/tasktree/commit/381623f0a15645ae1dca9f01b258942885f3527a) [`d88725f`](https://github.com/keindev/tasktree/commit/d88725f44c7d428e873a4ea36a9deae8b279f5d9)
-   **[Readme]** Rename bar to progress bar [`6750a82`](https://github.com/keindev/tasktree/commit/6750a8213f6a043f94d43142c7ac25ab4ef60823)
-   **[Readme]** Swap sections Usage & Example [`10ff861`](https://github.com/keindev/tasktree/commit/10ff86124b3fb41cf678f2df947f0f72765fbc91)
-   **[Readme]** Remove \-\-dev flags from Install [`f161739`](https://github.com/keindev/tasktree/commit/f1617398745c90305266218b3a77eb4f6a956dc9)
-   **[Readme]** Correct mistakes with Grammarly [`2378828`](https://github.com/keindev/tasktree/commit/23788286b4797407bf78d03a509f9c365232b3a3)
-   **[Readme]** Fix headers level [`4cfb310`](https://github.com/keindev/tasktree/commit/4cfb31023b2aa9894b98c2ea85f6f3dda55e4353)
-   **[Readme]** Update install section [`d941c82`](https://github.com/keindev/tasktree/commit/d941c8254ad3dcffdd3f3ac745cb9749207565cd)
-   **[Readme]** Update TaskTree methods description [`f4ce351`](https://github.com/keindev/tasktree/commit/f4ce3517528f09b13ac3b7f73d4f12fb66dbfbc4)
-   **[Readme]** Fix desc for api section [`acbd298`](https://github.com/keindev/tasktree/commit/acbd298708ab54a9dd87130d17d1ad92ee479c9a)
-   **[Readme, Package]** Fix package description [`5a4aaff`](https://github.com/keindev/tasktree/commit/5a4aaff6e76211078860e47d38c4767f0c2225c8)
-   **[TaskTree]** Fix test for tasktree [`ea29f62`](https://github.com/keindev/tasktree/commit/ea29f625ce42722242a13de1a0c64a99458c6c9c)
-   **[Template]** Fix errors [`3030e90`](https://github.com/keindev/tasktree/commit/3030e90867ece8b67e1f6879ecbaea7d1723b70c)
-   Add tests [`9549fd8`](https://github.com/keindev/tasktree/commit/9549fd8681ddca38a07cefd9f2ede225a07fa557)
-   Add codecov badge [`0b06aa6`](https://github.com/keindev/tasktree/commit/0b06aa67b9b2b70cd0a48478211043a6eb5ef944)
-   Add logo, usage info and demo [`8369c76`](https://github.com/keindev/tasktree/commit/8369c76f2e9be90644c0b932c875c3f80dca3485)
-   Change coverage to codacy [`46ec907`](https://github.com/keindev/tasktree/commit/46ec907e4df58f6f6c4f8e927b5f2639d95aec25)
-   Change description [`f3aa416`](https://github.com/keindev/tasktree/commit/f3aa416ecc672d22edb07781252534f004d4c9b5)
-   Update example app and readme [`f56a524`](https://github.com/keindev/tasktree/commit/f56a524549599b5c4be3c4f1a5775712f9e851de)
-   Add homepage & fix logo img url [`49c2f31`](https://github.com/keindev/tasktree/commit/49c2f312b4d7bf5722e12fe457729839bd0b01ab)
-   Increase logo size [`5354704`](https://github.com/keindev/tasktree/commit/535470467817270dbdf6321606ea35cf88407107)
-   Gif fix [`9ad3c37`](https://github.com/keindev/tasktree/commit/9ad3c37533af099cc717146a77659599b9491481)
-   Fix gif [`680a621`](https://github.com/keindev/tasktree/commit/680a621459ebaa381c711b6e510450c2f1bd786d)
-   Add code of conduct [`5c7e840`](https://github.com/keindev/tasktree/commit/5c7e840ac403aaa43f585484c245db87799d6c59)
-   Remove code of conduct [`39b9bdd`](https://github.com/keindev/tasktree/commit/39b9bdd11aa8b151f461f1a7e8cb74df221b8c58)
-   Fix test, rename figure to symbol [`938dec0`](https://github.com/keindev/tasktree/commit/938dec011e180cac628e159da4450d5b3c576b11)
-   Add usage section for TaskTree\.tree [`b7640c3`](https://github.com/keindev/tasktree/commit/b7640c3a51aabe5b2268c4da010ac7bd7608d677)
-   Fix codacy issue [`d581c78`](https://github.com/keindev/tasktree/commit/d581c7842b4b3d7401640e346cb01d09b5331820)
-   Change codacy to codecov [`7c225cb`](https://github.com/keindev/tasktree/commit/7c225cbdadd36e8b9afbca6a10e7e5ebe3d81a7c)
-   Fix \.travis conf [`b4b9741`](https://github.com/keindev/tasktree/commit/b4b974123cd55bd8d894a31e9c3c200c2325063a)
-   Add snyk integration [`e64fdf6`](https://github.com/keindev/tasktree/commit/e64fdf620dcecdb9a5ac5c9be2fb4acfb008de1f)
-   Add debugger out conf for vsc [`cc178cd`](https://github.com/keindev/tasktree/commit/cc178cd4487d3c9b32f2a2b0585b16aeec124e1e)
-   Remove unused\/commented code [`2af6d1c`](https://github.com/keindev/tasktree/commit/2af6d1c68601c7996f607645938407dbb9f598a5)
-   Refactor tests [`0539264`](https://github.com/keindev/tasktree/commit/0539264e47f2e593e9c22cc9958269605b9438b2) [`e881a33`](https://github.com/keindev/tasktree/commit/e881a33121513d5abb837ea8c03602ff2cee7a98)

# Code Refactoring

-   **[Task]** Rename isList to haveSubtasks [`19a7629`](https://github.com/keindev/tasktree/commit/19a762914464b72cbd51abe693402674df68a6ca)
-   **[Test]** Refactor tests [`00accd5`](https://github.com/keindev/tasktree/commit/00accd522c6a39155b88c42a1079a7244dd59430)

---

# Contributors

[![@keindev](https://avatars3.githubusercontent.com/u/4527292?v=4&size=40)](https://github.com/keindev)
[![@dependabot[bot]](https://avatars0.githubusercontent.com/in/29110?v=4&size=40)](https://github.com/dependabot%5Bbot%5D)
