import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

export default async function dbQuery(
  tag: string,
  queryEmptyProperty: boolean
) {
  let results = await logseq.DB.datascriptQuery(`
				[:find (pull ?b [*])
    		 :where
         [?b :block/path-refs [:block/name "${tag.substring(1)}"]]]
`);

  results = results
    .map((r: BlockEntity[]) => r[0])
    .filter((r: BlockEntity) => r.content !== tag)
    .filter((r: BlockEntity) =>
      queryEmptyProperty
        ? Object.keys(r.properties!).length === 0
        : Object.keys(r.properties!).length > 0
    );

  return results;
}
