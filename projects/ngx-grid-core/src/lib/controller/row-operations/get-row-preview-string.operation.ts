import { EMetadataType } from '../../typings/enums'
import { IGridDataSource } from '../../typings/interfaces'
import { IRowOperationFactory } from '../../typings/interfaces/grid-row-operation-factory.interface'
import { GridCellCoordinates } from '../../typings/interfaces/implementations/grid-cell-coordinates.implementation'
import { IRecordPreviewTemplateString } from '../../typings/interfaces/record-preview-template-string.interface'
import { TPrimaryKey } from '../../typings/types'
import { Operation } from '../operation.abstract'

export class GetRowPreviewString extends Operation {

  constructor(factory: IRowOperationFactory) { super(factory.gridController) }

  /**
   * Expands all available record preview template strings for a given row.
   * @param rowKey The primary key of the row.
   * @param source The grid data source.
   * @returns An array of expanded preview strings.
   */
  public getAll(rowKey: TPrimaryKey, source: IGridDataSource = this.dataSource): string[] {
    const templateStrings = source.metadata.get<IRecordPreviewTemplateString[]>(EMetadataType.RecordPreviewTemplateString) ?? []
    
    // Map each template string to its expanded value using the common private method.
    return templateStrings.map(template => this._expandTemplateString(rowKey, template.templateString, source));
  }

  /**
   * Expands the default row preview template string.
   * @param rowKey The primary key of the row.
   * @param source The grid data source.
   * @returns The expanded preview string.
   */
  public run(rowKey: TPrimaryKey, source: IGridDataSource = this.dataSource): string {
    
    if (source.rowTemplateString === undefined) {
      console.error(`RowPreviewTemplateString not set for grid ${this.gridOperations.GetGridId.run()}`);
      return '(preview not available)'
    }
    
    // Use the common private method to do the expansion.
    return this._expandTemplateString(rowKey, source.rowTemplateString, source);
  }

  /**
   * A common utility to expand a given template string with values from a given row.
   * @param rowKey The primary key of the row to get values from.
   * @param templateString The template string to expand (e.g., "ID: {{ID}}, Name: {{FirstName}} {{LastName}}").
   * @param source The grid data source.
   * @returns The fully expanded string.
   */
  private _expandTemplateString(rowKey: TPrimaryKey, templateString: string, source: IGridDataSource): string {
    const row = source.getRow(rowKey);
    
    // If the row doesn't exist, we can't expand the template, so return the key itself.
    if (!row) return (rowKey ?? '').toString();
    
    let output = templateString;

    for (const col of source.columns) {

      // Continue only if the template string includes the column key placeholder.
      if (output.includes(col.columnKey)) {
        
        const cellMeta = source.cellMeta.get(new GridCellCoordinates(row.rowKey, col.columnKey).compositeKey);
        const valueLocalizationKey = cellMeta?.metadata.get<string>(EMetadataType.ValueLocalizationKey);
        
        // Regex to find the placeholder, e.g., {{ColumnKey}}
        const regex = new RegExp(`\\{\\{(?:\\s+)?${col.columnKey}(?:\\s+)?\\}\\}`, 'g');
        
        let value: any;
        const underlyingValue = row.getValue(col.columnKey)?.value;
        
        // Localize the value if a localization key is provided in metadata.
        if (valueLocalizationKey !== null && valueLocalizationKey !== undefined) {
          value = this.controller.localize.getLocalizedString(valueLocalizationKey);
          // If the localization key was not found/expanded, fall back to the underlying value.
          if (value === valueLocalizationKey) value = underlyingValue;
        } else {
          value = underlyingValue;
        }

        // Replace the placeholder with the actual value. Use an empty string for null/undefined values.
        output = output.replace(regex, value ?? '');
      }
    }

    return output;
  }

}
