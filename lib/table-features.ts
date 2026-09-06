import {
  tableFeatures,
  rowSortingFeature,
  columnFilteringFeature,
  createSortedRowModel,
  createFilteredRowModel,
  filterFn_includesString,
} from "@tanstack/react-table";

export const features = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
});
