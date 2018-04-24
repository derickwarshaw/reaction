import ProductRevision from "/imports/plugins/core/revisions/server/no-meteor/ProductRevision";

/**
 * @method isLowQuantity
 * @summary If at least one of the product variants quantity is less than the low inventory threshold return `true`.
 * @memberof Catalog
 * @param {Array} variants - Array of child variants
 * @param {Object} collections - Raw collections
 * @return {boolean} low quantity or not
 */
export default async function isLowQuantity(variants, collections) {
  const promises = variants.map(async (variant) => {
    const quantity = await ProductRevision.getVariantQuantity(variant, collections);
    if (variant.inventoryManagement && variant.inventoryPolicy && quantity) {
      return quantity <= variant.lowInventoryWarningThreshold;
    }
    return false;
  });
  const results = await Promise.all(promises);
  return results.every((result) => result);
}