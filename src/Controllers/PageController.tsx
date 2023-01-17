import Roact from "@rbxts/roact";
import { InferEnumNames } from "../Utility/Types";

export interface PageControllerProps {
	Size?: UDim2;
	Position?: UDim2;
	SortOrder?: InferEnumNames<Enum.SortOrder> | Enum.SortOrder;
	SelectedPageIndex: number;
	TabIndexChanged?: (index: number) => void;
}
export interface PageControllerState {
	tabIndex: number;
}

/**
 * ### ZenUI::PageController
 *
 * A controller that controls page handling. Can be used for any scenario in which the UI requires different pages.
 */
export class PageController extends Roact.PureComponent<PageControllerProps, PageControllerState> {
	private page!: UIPageLayout;

	public constructor(props: PageControllerProps) {
		super(props);
		this.state = {
			tabIndex: props.SelectedPageIndex,
		};
	}

	public override didMount() {
		if (this.page) {
			this.setState({ tabIndex: this.props.SelectedPageIndex !== undefined ? this.props.SelectedPageIndex : 0 });
			this.props.SelectedPageIndex !== undefined && this.page.JumpToIndex(this.props.SelectedPageIndex);
		}
	}

	public override didUpdate(prevProps: PageControllerProps, prevState: PageControllerState) {
		if (prevProps.SelectedPageIndex !== this.props.SelectedPageIndex) {
			this.setState({ tabIndex: this.props.SelectedPageIndex ?? 0 });
		}
		if (prevState.tabIndex !== this.state.tabIndex) {
			this.page.JumpToIndex(this.state.tabIndex);
			if (this.props.TabIndexChanged) {
				this.props.TabIndexChanged(this.state.tabIndex);
			}
		}
	}

	public render() {
		const { Size: ContentSize, Position: ContentPosition, [Roact.Children]: children } = this.props;

		return (
			<frame ZIndex={2} ClipsDescendants BackgroundTransparency={1} Size={ContentSize} Position={ContentPosition}>
				<uipagelayout
					SortOrder={this.props.SortOrder ?? Enum.SortOrder.LayoutOrder}
					ScrollWheelInputEnabled={false}
					Animated={false}
					Ref={(page) => (this.page = page)}
				/>
				{children}
			</frame>
		);
	}
}
