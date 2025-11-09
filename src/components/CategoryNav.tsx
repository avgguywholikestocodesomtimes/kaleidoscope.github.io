import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  "For You",
  "Gaming",
  "Music",
  "Tech",
  "Education",
  "Entertainment",
  "Sports",
  "Cooking",
  "Travel",
  "Science",
  "Art",
  "Fashion"
];

const CategoryNav = () => {
  return (
    <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-16 z-40">
      <div className="container px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 py-4">
            {categories.map((category, index) => (
              <Button
                key={category}
                variant={index === 0 ? "gradient" : "secondary"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default CategoryNav;
