import { GridControllerService } from "../../controller/grid-controller.service"
import { IKeyCombination } from "./key-combination.interface"

export interface IKeyboardShortcut {
    key: IKeyCombination | IKeyCombination[]
    action?: (controller: GridControllerService) => void
}