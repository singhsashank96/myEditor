import java.util.Scanner;
public class Test {
  public static void main(String[] args) {

    // Scanner class object to read input
    Scanner scan = new Scanner(System.in);

    // declaring and creating array objects
    int[] arr = new int[5];

    // displaying default values
    System.out.println("Default values of array:");
    for (int i=0; i < arr.length; i++) {
      System.out.print(arr[i]+"\t");
    }

    // initializing array
    System.out.println("\n\n***Initializing Array***");
    System.out.println("Enter "+ arr.length
                     + " integer values:");

    for(int i=0; i < arr.length; i++) {
      // read input
      arr[i] = scan.nextInt();
    }
    System.out.println("***Initialization completed***\n");

    //displaying initialized values
    System.out.println("Array elements are:");
    for (int i=0; i < arr.length; i++) {
      System.out.print(arr[i]+"\t");
    }

  }
}