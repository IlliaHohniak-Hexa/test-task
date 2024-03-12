#### 1. Since the file is big, first step is dividing it into smaller logic pieces and remove repeatable parts:
   - Move types/interfaces/enums to types.ts. Also, in original file types were exported, that is not needed as they were used in the same file. It's optional, but in the InternalFileType unused enums could be deleted.
   - Move loadPdfCover, loadImageCover, getTrialFormattedPrice, getAnnualFormattedPrice, getCurrency to the helpers.tsx 
   - Create helper getBullets to get bullets list. It's relevant only if this list is some kind of constant. But if in the original file it was created manually to update it often, this helper will not be useful
   - Change getPlans - get plans in the loop
   - Create custom hook. There were a few useEffects in the original file, which could be moved. Almost all useStates are needed only for useEffects - move it to the new hook
> Custom hook is just my suggestion. It could be unnecessary because we are actually working with a hook


#### 2. Second step is working on improving the code, resolving some problems:
   - Change importing of React hooks. Small step, but it makes code a bit clearer
   - Changes in functions loadPdfCover and loadImageCover:
     - unnecessary try-finally block
     - move repeatable getting url code
     - create editUrl and downloadUrl to clear ternary operator
     >Unfortunately there is a bug in this logic. Before refactoring getting pdf cover runs too much times and broke tab. Now it doesn't correctly signal about updating the cover. It'll take more time than expected 3-4h, so I decided to leave a note about it. 
  - Fix problems with types in getPlans - for t-function, id in the plan object
  - Fix errors with optional chaining in getPlans: by mistake was used ! and ? are unnecessary
  - Delete optional chaining in useEffect in useInteractor
  - Logic "user.email !== null" is always true and it break the function, the part with API.auth will never be executed. Here are two options - delete first or second IF. I chose first
  - Fix functions getTrialFormattedPrice, getAnnualFormattedPrice, getCurrency - update logic, remove repeatable parts. Could be created enums and objects for currencies
  - 
